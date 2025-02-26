const PdfPrinter = require('pdfmake');
const QRCode = require('qrcode');
const path = require('path');

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const generateInvoicePDF = async (req, res) => {
  try {
    const formData = req.body;
    const theme = formData.theme || {
      primaryColor: '#2962ff',
      secondaryColor: '#1a237e',
      accentColor: '#ff3d00',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      headerFontSize: 24,
      bodyFontSize: 10,
    };
    
    const printer = new PdfPrinter(fonts);

    // Generar QR code
    const qrCodeData = await QRCode.toDataURL(JSON.stringify({
      emisor: formData.empresaNombre,
      rncEmisor: formData.empresaRNC,
      cliente: formData.clienteNombre,
      rncCliente: formData.clienteRNC,
      numeroFactura: formData.numeroFactura,
      fecha: formData.fecha,
      total: formData.total
    }));

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 60],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: theme.bodyFontSize,
        lineHeight: 1.2,
        color: theme.textColor
      },
      background: function() {
        return {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 595.28,
              h: 841.89,
              color: theme.backgroundColor
            }
          ]
        };
      },
      watermark: {
        text: 'FACTURA',
        color: `${theme.primaryColor}10`,
        opacity: 0.1,
        bold: true,
        fontSize: 60
      },
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', color: theme.secondaryColor }
          ],
          margin: [40, 0]
        };
      },
      content: [
        // Encabezado con logo y datos del emisor
        {
          columns: [
            formData.empresaLogo ? {
              image: formData.empresaLogo,
              width: 150,
              fit: [150, 150],
              margin: [0, 0, 20, 0]
            } : {},
            {
              stack: [
                { 
                  text: formData.empresaNombre,
                  style: 'header',
                  color: theme.primaryColor
                },
                { 
                  text: `RNC: ${formData.empresaRNC}`,
                  style: 'subheader',
                  color: theme.secondaryColor
                },
                { text: formData.empresaDireccion },
                { text: `Tel: ${formData.empresaTelefono}` },
                { text: formData.empresaEmail }
              ]
            }
          ]
        },
        
        // Información de la factura
        {
          style: 'invoiceInfo',
          columns: [
            {
              stack: [
                { 
                  text: 'FACTURA',
                  style: 'invoiceTitle',
                  color: theme.primaryColor
                },
                { text: `No.: ${formData.numeroFactura}`, bold: true },
                { text: `Fecha: ${new Date(formData.fecha).toLocaleDateString('es-DO')}` },
                formData.vencimiento && { 
                  text: `Vencimiento: ${new Date(formData.vencimiento).toLocaleDateString('es-DO')}`,
                  color: theme.accentColor
                }
              ]
            }
          ]
        },

        // Línea divisoria
        {
          canvas: [
            { 
              type: 'line',
              x1: 0, y1: 0, x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: theme.primaryColor
            }
          ],
          margin: [0, 20]
        },

        // Datos del cliente con mejor formato
        {
          style: 'clientInfo',
          stack: [
            { 
              text: 'INFORMACIÓN DEL CLIENTE',
              style: 'subheader',
              color: theme.primaryColor,
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'Nombre:',
                  bold: true,
                  margin: [0, 0, 10, 0]
                },
                { text: formData.clienteNombre }
              ]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'RNC:',
                  bold: true,
                  margin: [0, 0, 10, 0]
                },
                { text: formData.clienteRNC }
              ]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'Dirección:',
                  bold: true,
                  margin: [0, 0, 10, 0]
                },
                { text: formData.clienteDireccion }
              ]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'Teléfono:',
                  bold: true,
                  margin: [0, 0, 10, 0]
                },
                { text: formData.clienteTelefono }
              ]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'Email:',
                  bold: true,
                  margin: [0, 0, 10, 0]
                },
                { text: formData.clienteEmail }
              ]
            }
          ]
        },

        // Tabla de productos/servicios con mejor diseño
        {
          style: 'productTable',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Descripción', style: 'tableHeader', fillColor: theme.primaryColor },
                { text: 'Cantidad', style: 'tableHeader', fillColor: theme.primaryColor },
                { text: 'Precio Unit.', style: 'tableHeader', fillColor: theme.primaryColor },
                { text: 'ITBIS', style: 'tableHeader', fillColor: theme.primaryColor },
                { text: 'Total', style: 'tableHeader', fillColor: theme.primaryColor }
              ],
              ...formData.items.map((item, index) => [
                item.descripcion,
                { text: item.cantidad, alignment: 'center' },
                { text: formatCurrency(item.precioUnitario, formData.moneda), alignment: 'right' },
                { text: `${item.impuesto}%`, alignment: 'right' },
                { 
                  text: formatCurrency(
                    item.cantidad * item.precioUnitario * (1 + item.impuesto/100) * (1 - item.descuento/100),
                    formData.moneda
                  ),
                  alignment: 'right',
                  bold: true
                }
              ]).map((row, i) => row.map(cell => ({
                ...cell,
                fillColor: i % 2 === 0 ? theme.backgroundColor : `${theme.primaryColor}10`
              })))
            ]
          }
        },

        // Resumen de totales con mejor diseño
        {
          style: 'summary',
          columns: [
            {
              width: '*',
              stack: [
                formData.notas && {
                  text: [
                    { text: 'Notas: ', bold: true, color: theme.secondaryColor },
                    { text: formData.notas, italics: true }
                  ],
                  margin: [0, 10]
                }
              ]
            },
            {
              width: 200,
              style: 'totals',
              stack: [
                { 
                  columns: [
                    { text: 'Subtotal:', alignment: 'right', width: 100 },
                    { 
                      text: formatCurrency(formData.subtotal, formData.moneda),
                      alignment: 'right',
                      width: 100
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { 
                  columns: [
                    { text: 'ITBIS:', alignment: 'right', width: 100 },
                    { 
                      text: formatCurrency(formData.itbis, formData.moneda),
                      alignment: 'right',
                      width: 100
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                formData.descuentoGlobal > 0 && { 
                  columns: [
                    { text: 'Descuento Global:', alignment: 'right', width: 100 },
                    { 
                      text: `${formData.descuentoGlobal}%`,
                      alignment: 'right',
                      width: 100,
                      color: theme.accentColor
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { 
                  columns: [
                    { text: 'Total:', alignment: 'right', width: 100, bold: true },
                    { 
                      text: formatCurrency(formData.total, formData.moneda),
                      alignment: 'right',
                      width: 100,
                      bold: true,
                      color: theme.primaryColor,
                      fontSize: theme.bodyFontSize + 2
                    }
                  ],
                  margin: [0, 5]
                }
              ]
            }
          ]
        },

        // Pie de página con firma y QR
        {
          columns: [
            (formData.signature || formData.empresaFirma) ? {
              stack: [
                { 
                  image: formData.signature || formData.empresaFirma, 
                  width: 150 
                },
                { 
                  text: 'Firma Autorizada',
                  alignment: 'center',
                  margin: [0, 5],
                  fontSize: theme.bodyFontSize - 2,
                  color: theme.secondaryColor
                }
              ]
            } : {},
            {
              stack: [
                { image: qrCodeData, width: 100, alignment: 'right' },
                { 
                  text: 'Escanee para verificar',
                  alignment: 'right',
                  fontSize: theme.bodyFontSize - 2,
                  color: theme.secondaryColor
                }
              ]
            }
          ],
          margin: [0, 30]
        }
      ],
      styles: {
        header: {
          fontSize: theme.headerFontSize,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        subheader: {
          fontSize: theme.bodyFontSize + 6,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        invoiceTitle: {
          fontSize: theme.headerFontSize + 4,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        invoiceInfo: {
          margin: [0, 20, 0, 20]
        },
        clientInfo: {
          margin: [0, 20, 0, 20]
        },
        productTable: {
          margin: [0, 20]
        },
        tableHeader: {
          bold: true,
          fontSize: theme.bodyFontSize + 1,
          color: '#ffffff',
          margin: [0, 5, 0, 5]
        },
        summary: {
          margin: [0, 30]
        },
        totals: {
          fontSize: theme.bodyFontSize + 1
        }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=factura-${formData.numeroFactura}.pdf`);
      res.send(result);
    });

    pdfDoc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando el PDF' });
  }
};

function formatCurrency(amount, currency) {
  const formatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: currency || 'USD'
  });
  return formatter.format(amount);
}

module.exports = {
  generateInvoicePDF
}; 