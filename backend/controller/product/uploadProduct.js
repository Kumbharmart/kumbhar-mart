const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function UploadProductController(req, res) {
    try {
      const { productName, brandName, category, subcategory, productImage, price, sellingPrice, quantity, soldBy, percentOff, gst, gstAmount,margin, sellerId } = req.body;
  
  
      const productData = {
        productName,
        brandName,
        category,
        subcategory,
        productImage,
        price,
        sellingPrice,
        quantity,
        soldBy,
        percentOff,
        gst,
        gstAmount,
        margin,
        sellerId,
      };
  
      console.log("Product data to save:", productData);
  
      const uploadProduct = new productModel(productData);
      const saveProduct = await uploadProduct.save();
  
      res.status(201).json({
        message: "Product uploaded successfully",
        error: false,
        success: true,
        data: saveProduct,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message || "An error occurred",
        error: true,
        success: false,
      });
    }
}

  

module.exports = UploadProductController;
