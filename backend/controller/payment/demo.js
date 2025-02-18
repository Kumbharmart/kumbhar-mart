const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
const fontPath = 'path_to_your_font.ttf'; // Example: './fonts/NotoSansDevanagari-Regular.ttf'

// Register and set font
doc.registerFont('MarathiFont', fontPath);
doc.font('MarathiFont'); // Use it for text rendering

doc.fillColor('#000000')
   .text(`${index + 1}. ${product.name}`, 55, currentY) // Handles both English & Marathi
   .text(`${mrpPrice.toFixed(2)}`, 200, currentY, { align: 'center' })
   .text(`${product.quantity}`, 300, currentY, { align: 'center' })
   .text(`${gst}%`, 400, currentY, { align: 'center' })
   .text(`${(productTotal).toFixed(2)}`, 500, currentY, { align: 'right' });

doc.end();
