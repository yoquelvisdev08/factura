const supabase = require('../config/supabase');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

// Obtener todos los documentos de un usuario
exports.getAllDocuments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    // Si la tabla no existe, devolvemos un array vacío en lugar de un error
    if (error.message.includes('relation "public.documents" does not exist')) {
      console.log('La tabla documents no existe. Devolviendo array vacío.');
      return [];
    }
    throw error;
  }
};

// Obtener un documento específico
exports.getDocumentById = async (documentId, userId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener documento:', error);
    // Si la tabla no existe, devolvemos null en lugar de un error
    if (error.message.includes('relation "public.documents" does not exist')) {
      console.log('La tabla documents no existe. Devolviendo null.');
      return null;
    }
    throw error;
  }
};

// Crear un nuevo documento
exports.createDocument = async (documentData) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        user_id: documentData.user_id,
        type: documentData.type,
        title: documentData.title || 'Documento sin título',
        description: documentData.description || '',
        status: documentData.status || 'draft',
        data: documentData.data || {},
        file_path: documentData.file_path || null,
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al crear documento:', error);
    throw error;
  }
};

// Actualizar un documento existente
exports.updateDocument = async (documentId, userId, documentData) => {
  try {
    const { data: existingDocument } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (!existingDocument) return null;

    const { data, error } = await supabase
      .from('documents')
      .update({
        ...documentData,
        updated_at: new Date()
      })
      .eq('id', documentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    throw error;
  }
};

// Eliminar un documento
exports.deleteDocument = async (documentId, userId) => {
  try {
    const { data: existingDocument } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (!existingDocument) return null;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

// Obtener documentos por tipo
exports.getDocumentsByType = async (userId, type) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener documentos por tipo:', error);
    // Si la tabla no existe, devolvemos un array vacío en lugar de un error
    if (error.message.includes('relation "public.documents" does not exist')) {
      console.log('La tabla documents no existe. Devolviendo array vacío.');
      return [];
    }
    throw error;
  }
};

// Generar PDF basado en tipo de documento
exports.generatePdf = async (document) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfBuffer = [];
      const doc = new PDFDocument({ margin: 50 });

      doc.on('data', (chunk) => pdfBuffer.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(pdfBuffer)));
      doc.on('error', (err) => reject(err));

      // Estilos comunes
      const titleFont = 'Helvetica-Bold';
      const regularFont = 'Helvetica';
      const primaryColor = '#3f51b5';
      const textColor = '#333333';

      // Configuración según tipo de documento
      switch (document.type) {
        case 'invoice':
          generateInvoicePdf(doc, document.data, { titleFont, regularFont, primaryColor, textColor });
          break;
        case 'contract':
          generateContractPdf(doc, document.data, { titleFont, regularFont, primaryColor, textColor });
          break;
        case 'legal':
          generateLegalDocPdf(doc, document.data, { titleFont, regularFont, primaryColor, textColor });
          break;
        default:
          throw new Error('Tipo de documento no soportado');
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generador de PDF para facturas
function generateInvoicePdf(doc, data, styles) {
  const { titleFont, regularFont, primaryColor, textColor } = styles;
  
  // Encabezado
  doc.font(titleFont).fontSize(24).fillColor(primaryColor);
  doc.text('FACTURA', { align: 'center' });
  doc.moveDown();
  
  // Información de la empresa
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('De:', { continued: true }).font(regularFont).text(` ${data.company || 'Nombre Empresa'}`);
  doc.text('NIF/CIF:', { continued: true }).font(regularFont).text(` ${data.taxId || '-'}`);
  doc.text('Dirección:', { continued: true }).font(regularFont).text(` ${data.address || '-'}`);
  doc.text('Teléfono:', { continued: true }).font(regularFont).text(` ${data.phone || '-'}`);
  doc.moveDown(2);
  
  // Información del cliente
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('Para:', { continued: true }).font(regularFont).text(` ${data.clientName || 'Nombre Cliente'}`);
  doc.text('NIF/CIF:', { continued: true }).font(regularFont).text(` ${data.clientTaxId || '-'}`);
  doc.text('Dirección:', { continued: true }).font(regularFont).text(` ${data.clientAddress || '-'}`);
  doc.moveDown(2);
  
  // Detalles de la factura
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('Número:', { continued: true }).font(regularFont).text(` ${data.invoiceNumber || '-'}`);
  doc.text('Fecha:', { continued: true }).font(regularFont).text(` ${data.date ? new Date(data.date).toLocaleDateString() : '-'}`);
  doc.moveDown(2);
  
  // Tabla de items
  const tableTop = doc.y;
  let tablePosition = tableTop;
  
  // Encabezados de tabla
  doc.font(titleFont).fontSize(12).fillColor(primaryColor);
  doc.text('Descripción', 50, tablePosition, { width: 250 });
  doc.text('Cantidad', 300, tablePosition, { width: 50, align: 'center' });
  doc.text('Precio', 350, tablePosition, { width: 100, align: 'center' });
  doc.text('Total', 450, tablePosition, { width: 90, align: 'right' });
  
  tablePosition += 20;
  doc.moveTo(50, tablePosition).lineTo(540, tablePosition).stroke(primaryColor);
  tablePosition += 10;
  
  // Items
  let totalAmount = 0;
  doc.font(regularFont).fontSize(12).fillColor(textColor);
  
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach(item => {
      const lineTotal = (item.quantity || 0) * (item.price || 0);
      totalAmount += lineTotal;
      
      doc.text(item.description || '-', 50, tablePosition, { width: 250 });
      doc.text(item.quantity?.toString() || '0', 300, tablePosition, { width: 50, align: 'center' });
      doc.text(`${item.price?.toFixed(2) || '0.00'} €`, 350, tablePosition, { width: 100, align: 'center' });
      doc.text(`${lineTotal.toFixed(2)} €`, 450, tablePosition, { width: 90, align: 'right' });
      
      tablePosition += 25;
      
      // Nueva página si es necesario
      if (tablePosition > 700) {
        doc.addPage();
        tablePosition = 50;
      }
    });
  }
  
  // Línea de separación
  doc.moveTo(50, tablePosition).lineTo(540, tablePosition).stroke(primaryColor);
  tablePosition += 10;
  
  // Totales
  const tax = (data.taxRate || 0) * totalAmount / 100;
  const grandTotal = totalAmount + tax;
  
  doc.text('Subtotal:', 350, tablePosition, { width: 100 });
  doc.text(`${totalAmount.toFixed(2)} €`, 450, tablePosition, { width: 90, align: 'right' });
  tablePosition += 20;
  
  doc.text(`IVA (${data.taxRate || 0}%):`, 350, tablePosition, { width: 100 });
  doc.text(`${tax.toFixed(2)} €`, 450, tablePosition, { width: 90, align: 'right' });
  tablePosition += 20;
  
  doc.font(titleFont).fontSize(14).fillColor(primaryColor);
  doc.text('TOTAL:', 350, tablePosition, { width: 100 });
  doc.text(`${grandTotal.toFixed(2)} €`, 450, tablePosition, { width: 90, align: 'right' });
  
  // Pie de página
  doc.moveDown(5);
  doc.font(regularFont).fontSize(10).fillColor(textColor);
  doc.text(data.notes || 'Gracias por su confianza', { align: 'center' });
}

// Generador de PDF para contratos
function generateContractPdf(doc, data, styles) {
  const { titleFont, regularFont, primaryColor, textColor } = styles;
  
  // Título
  doc.font(titleFont).fontSize(24).fillColor(primaryColor);
  doc.text(data.title || 'CONTRATO', { align: 'center' });
  doc.moveDown();
  
  // Partes
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('REUNIDOS', { align: 'center' });
  doc.moveDown();
  
  doc.font(regularFont).fontSize(12);
  doc.text(`De una parte, ${data.partyA || '[Nombre de la Parte A]'}, con CIF/NIF ${data.partyAId || '[ID]'} y domicilio en ${data.partyAAddress || '[Dirección]'}, en adelante "EL PROVEEDOR".`);
  doc.moveDown(2);
  doc.text(`Y de otra parte, ${data.partyB || '[Nombre de la Parte B]'}, con CIF/NIF ${data.partyBId || '[ID]'} y domicilio en ${data.partyBAddress || '[Dirección]'}, en adelante "EL CLIENTE".`);
  doc.moveDown(2);
  
  // Exponen
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('EXPONEN', { align: 'center' });
  doc.moveDown();
  
  doc.font(regularFont).fontSize(12);
  doc.text(data.exposition || 'Que ambas partes están interesadas en formalizar el presente contrato con arreglo a las siguientes cláusulas:');
  doc.moveDown(2);
  
  // Cláusulas
  doc.font(titleFont).fontSize(14).fillColor(textColor);
  doc.text('CLÁUSULAS', { align: 'center' });
  doc.moveDown();
  
  if (data.clauses && Array.isArray(data.clauses)) {
    data.clauses.forEach((clause, index) => {
      doc.font(titleFont).fontSize(12).fillColor(textColor);
      doc.text(`CLÁUSULA ${index + 1}: ${clause.title || ''}`, { continued: false });
      doc.moveDown(0.5);
      doc.font(regularFont).fontSize(12);
      doc.text(clause.content || '');
      doc.moveDown();
      
      // Nueva página si es necesario
      if (doc.y > 700) {
        doc.addPage();
      }
    });
  }
  
  // Firma
  doc.moveDown(2);
  doc.font(titleFont).fontSize(12).fillColor(textColor);
  doc.text('Y en prueba de conformidad, firman el presente documento por duplicado,', { align: 'center' });
  doc.font(regularFont);
  doc.text(`en ${data.place || '[Lugar]'}, a ${data.contractDate ? new Date(data.contractDate).toLocaleDateString() : '[Fecha]'}.`, { align: 'center' });
  
  doc.moveDown(4);
  doc.font(titleFont).fontSize(12);
  const signatureX = 150;
  doc.text('Firma de EL PROVEEDOR', signatureX - 100, doc.y, { width: 200, align: 'center' });
  doc.text('Firma de EL CLIENTE', signatureX + 200, doc.y, { width: 200, align: 'center' });
}

// Generador de PDF para documentos legales
function generateLegalDocPdf(doc, data, styles) {
  const { titleFont, regularFont, primaryColor, textColor } = styles;
  
  // Título
  doc.font(titleFont).fontSize(24).fillColor(primaryColor);
  doc.text(data.title || 'DOCUMENTO LEGAL', { align: 'center' });
  doc.moveDown();
  
  // Fecha y lugar
  doc.font(regularFont).fontSize(12).fillColor(textColor);
  doc.text(`${data.place || '[Lugar]'}, ${data.date ? new Date(data.date).toLocaleDateString() : '[Fecha]'}`, { align: 'right' });
  doc.moveDown(2);
  
  // Destinatario
  if (data.recipient) {
    doc.font(titleFont).fontSize(12);
    doc.text(data.recipient);
    if (data.recipientPosition) doc.text(data.recipientPosition);
    if (data.recipientCompany) doc.text(data.recipientCompany);
    if (data.recipientAddress) doc.text(data.recipientAddress);
    doc.moveDown(2);
  }
  
  // Saludo
  doc.font(regularFont).fontSize(12);
  doc.text(data.greeting || 'Estimado/a Sr./Sra.:');
  doc.moveDown();
  
  // Contenido principal
  if (data.content) {
    doc.text(data.content, { align: 'justify' });
  }
  
  // Despedida
  doc.moveDown(2);
  doc.text(data.farewell || 'Atentamente,');
  doc.moveDown(4);
  
  // Firma
  doc.font(titleFont).fontSize(12);
  doc.text(data.sender || '[Nombre]');
  if (data.senderPosition) doc.text(data.senderPosition);
  if (data.senderCompany) doc.text(data.senderCompany);
  if (data.senderContact) doc.text(data.senderContact);
} 