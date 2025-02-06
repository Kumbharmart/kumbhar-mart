const Razorpay = require('razorpay');
const Order = require('../../models/order');
const userModel = require("../../models/userModel");
const productModel = require('../../models/productModel');
const Seller = require("../../models/sellerModel");
const PDFDocument = require('pdfkit');
const AWS = require('aws-sdk');
require('dotenv').config();
const moment = require('moment');
// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET_KEY,
});

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_BUCKET_REGION,
});

const s3 = new AWS.S3();

const createOrder = async (req, res) => {
    const { 
        amount, 
        currency, 
        receipt, 
        userId, 
        products, 
        deliveryAddress, 
        isTakeFromShop 
    } = req.body;
    
   
    let deliveryCharges = 0;
    if (!isTakeFromShop) {
        // Only apply delivery charges if not "Take From Shop"
        if (amount < 1000) {
            deliveryCharges = 20; // Apply delivery charges for orders below 500
        }
    }
    // Calculate the total amount including delivery charges
    const totalAmount = amount + deliveryCharges;
    try {
        // Razorpay order options
        const options = {
            amount: Math.ceil(totalAmount * 100), // Convert to paisa (smallest unit of currency)
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`,
        };
// Configure AWS S3


// Create Razorpay Order
// Create Razorpay Order


        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create(options);

        // Create new order in database
        const newOrder = new Order({
            order_id: razorpayOrder.id,
            products: products.map(product => ({
                productId: product.productId._id,
                name: product.productId.productName,
                quantity: product.quantity,
                price: product.productId.sellingPrice,
                image: product.productId.productImage,
            })),
            amount: razorpayOrder.amount / 100, // Convert back to main currency unit
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            userId: userId,
            deliveryAddress: deliveryAddress,
        });

        await newOrder.save();

        // Return success response
        res.status(200).json({
            success: true,
            order: razorpayOrder,
            finalAmount:  Math.ceil(totalAmount), // Return the original amount as final amount
        });
    } catch (error) {
        console.error("Error creating Razorpay order", error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// Handle Payment Success
const handlePaymentSuccess = async (req, res) => {
    const { order_id, payment_id, signature, userId } = req.body;
    const currentMonth = moment().format('YYYY-MM');

    try {
        const order = await Order.findOne({ order_id }).populate('userId').populate('products.productId');
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        order.payment_id = payment_id;
        order.signature = signature;
        order.status = 'paid';

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update user's businessPrices
        let userMonthEntry = user.businessPrices.find(entry => entry.month === currentMonth);
        if (userMonthEntry) {
            userMonthEntry.myPurchase += order.amount;
        } else {
            user.businessPrices.push({
                month: currentMonth,
                myPurchase: order.amount,
                totalPurchase: 0,
                totalIncentive: 0,
                status: 'pending'
            });
        }
        await user.save();

        // Update products and seller revenue
        for (const item of order.products) {
            const product = await productModel.findById(item.productId);
            if (product && product.quantity >= item.quantity) {
                product.quantity -= item.quantity;
                await product.save();

                const sellerRevenue = Math.ceil(product.sellingPrice * 0.5);
                await Seller.findByIdAndUpdate(product.sellerId, {
                    $inc: { "businessPrices.$[elem].totalRevenue": sellerRevenue }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product: ${product?.productName || 'Unknown'}`
                });
            }
        }

        // Handle referral system
        if (user.refferal?.refferredbycode) {
            const referrer = await userModel.findOne({ 'refferal.refferalcode': user.refferal.refferredbycode });
            if (referrer) {
                const totalIncentive = Math.floor(0.05 * order.amount);
                let referrerMonthEntry = referrer.businessPrices.find(entry => entry.month === currentMonth);

                if (referrerMonthEntry) {
                    referrerMonthEntry.totalPurchase += order.amount;
                    referrerMonthEntry.totalIncentive += totalIncentive;
                } else {
                    referrer.businessPrices.push({
                        month: currentMonth,
                        myPurchase: 0,
                        totalPurchase: order.amount,
                        totalIncentive: totalIncentive,
                        status: 'pending'
                    });
                }
                referrer.refferal.myrefferalorders.push({ userId: user._id, order_id: order._id });
                await referrer.save();
            }
        }

        // Generate and upload invoice
        const invoiceUrl = await generateInvoiceAndUploadToS3(order);
        order.invoicePath = invoiceUrl;
        await order.save();

        res.status(200).json({ success: true, message: "Payment successful, order updated", invoiceUrl });
    } catch (error) {
        console.error("Error updating order after payment", error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// Generate Invoice and Upload to S3
const generateInvoiceAndUploadToS3 = async (order) => {
    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks);

            const params = {
                Bucket: process.env.REACT_APP_BUCKET_NAME,
                Key: `invoices/${order.order_id}.pdf`,
                Body: pdfBuffer,
                ContentType: 'application/pdf',
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.error("Error uploading invoice to S3:", err);
                    return reject(err);
                }
                console.log("Invoice uploaded successfully:", data.Location);
                resolve(data.Location);
            });
        });

        // Title Section with logo and company info
        doc.image('Images/kmlogo.jpg', 50, 40, { width: 100 , align: 'center'});
        doc.fontSize(25).text('Kumbhar Mart', { align: 'center', bold: true });
        doc.fontSize(10).text('Contact: +91-7722035103 | Email: martkumbhar@gmail.com', { align: 'center' });
        doc.moveDown(1);

        // "Issued To" Section
        doc.fontSize(14).text('Issued To:', { underline: true });
        doc.fontSize(12)
            .text(`${order.deliveryAddress.name}`)
            .text(`${order.deliveryAddress.mobileNo}`)
            .text(`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zip}`)
            .moveDown(2);

        // Invoice Details Section
        doc.fontSize(14).text('Invoice Details:', { underline: true });
        doc.fontSize(12)
            .text(`Invoice No: ${order._id}`)
            .text(`Date: ${new Date().toLocaleDateString()}`)
            .moveDown(2);

        // Table Header with background color and bold font
        const headerY = doc.y;
        doc.fontSize(12).font('Helvetica-Bold');
        doc.rect(50, headerY, 500, 20).fill('#007BFF'); // Header background color
        doc.fillColor('#ffffff');
        doc.text('Description', 55, headerY + 5)
            .text('Unit Price', 200, headerY + 5, { align: 'center' })
            .text('Qty', 300, headerY + 5, { align: 'center' })
            .text('GST%', 400, headerY + 5, { align: 'center' })
            .text('Total', 500, headerY + 5, { align: 'right' });

        doc.moveTo(50, headerY + 20).lineTo(550, headerY + 20).stroke(); // Line below header
        doc.y = headerY + 25;
        doc.font('Helvetica').fontSize(10);
        const headerYz = doc.y;

        let totalAmount = 0;
        const productDetailsMap = await Promise.all(
            order.products.map(async (product) => {
                const productDetails = await productModel.findById(product.productId);
                return {
                    productId: product.productId,
                    mrpPrice: productDetails?.sellingPrice || 0,
                    gst: productDetails?.gst || 0,
                };
            })
        );

        const productDetailsLookup = productDetailsMap.reduce((acc, curr) => {
            acc[curr.productId.toString()] = {
                mrpPrice: curr.mrpPrice,
                gst: curr.gst,
            };
            return acc;
        }, {});

        let currentY = headerYz; // Start from the initial position

        // Product rows with alternating row colors
        order.products.forEach((product, index) => {
            const productData = productDetailsLookup[product.productId.toString()] || {};
            const mrpPrice = productData.mrpPrice || 0;
            const gst = productData.gst || 0;

            const productTotal = mrpPrice * product.quantity;
            const gstAmount = (productTotal * gst) / 100;
            totalAmount += productTotal ;

            // Alternating row color
            const rowColor = index % 2 === 0 ? '#f1f1f1' : '#ffffff';
            doc.rect(50, currentY - 2, 500, 18).fill(rowColor); // Row background color

            // Print product details in a row
            doc.fillColor('#000000')
                .text(`${index + 1}. ${product.name}`, 55, currentY)
                .text(`${mrpPrice.toFixed(2)}`, 200, currentY, { align: 'center' })
                .text(`${product.quantity}`, 300, currentY, { align: 'center' })
                .text(`${gst}%`, 400, currentY, { align: 'center' })
                .text(`${(productTotal).toFixed(2)}`, 500, currentY, { align: 'right' });

            doc.moveTo(50, currentY + 18).lineTo(550, currentY + 18).stroke(); // Line below product row

            currentY += 20; // Adjust row height as needed
        });

        // Calculate delivery charges
        const deliveryCharges = order.deliveryAddress.isTakeFromShop ? 0 : (totalAmount < 1000 ? 20 : 0);
        const discount = totalAmount * 0.05; // 5% discount
        const discountedAmount = totalAmount + deliveryCharges;
        const finalTotal = (discountedAmount);
      
        // Subtotal, Discount, Delivery Charges, and Total section
doc.moveDown(1);
doc.font('Helvetica-Bold')
    .text('Subtotal:', 250, doc.y, { align: 'right', continued: true })
    .text(`${totalAmount}`, 300, doc.y, { align: 'right' });

doc.moveDown(0.5);
doc.text('Delivery Charges:', 250, doc.y, { align: 'right', continued: true })
    .text(`${deliveryCharges.toFixed(2)}`, 300, doc.y, { align: 'right' });

doc.moveDown(1);
doc.fontSize(14).font('Helvetica-Bold')
    .text('Total:', 250, doc.y, { align: 'right', continued: true })
    .text(`${finalTotal.toFixed(2)}`, 300, doc.y, { align: 'right' });

        // Footer Section with company details
        doc.moveDown(2);
        doc.fontSize(10).text('Kumbhar Mart | Opposite Z.Z.P School, Shimpore (New), Khednagar | martkumbhar@gmail.com', { align: 'center' });

        // Finalize the PDF
        doc.end();
    });
};

module.exports = { createOrder, handlePaymentSuccess };