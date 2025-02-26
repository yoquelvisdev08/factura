import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fuentes
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
  ]
});

const FacturaProfesional = ({ formData }) => {
  const { theme = {
    primaryColor: '#2962ff',
    secondaryColor: '#1a237e',
    accentColor: '#ff3d00',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headerFontSize: 24,
    bodyFontSize: 10,
  }} = formData;

  const styles = StyleSheet.create({
    page: {
      padding: 50,
      backgroundColor: theme.backgroundColor
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    headerLeft: {
      flexDirection: 'column',
    },
    headerRight: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    logo: {
      width: 150,
      height: 'auto',
      marginBottom: 10,
    },
    title: {
      fontSize: theme.headerFontSize,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 15,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    infoSection: {
      width: '48%',
    },
    sectionTitle: {
      fontSize: theme.bodyFontSize + 2,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 5,
      textTransform: 'uppercase',
    },
    infoText: {
      fontSize: theme.bodyFontSize,
      marginBottom: 3,
      color: theme.textColor,
    },
    table: {
      marginTop: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.primaryColor,
      color: '#FFFFFF',
      padding: 8,
      fontSize: theme.bodyFontSize,
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#EEEEEE',
      padding: 8,
      fontSize: theme.bodyFontSize,
    },
    col1: { width: '40%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '15%', textAlign: 'right' },
    col4: { width: '15%', textAlign: 'right' },
    col5: { width: '15%', textAlign: 'right' },
    totals: {
      marginTop: 30,
      alignItems: 'flex-end',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 5,
    },
    totalLabel: {
      width: 100,
      textAlign: 'right',
      marginRight: 10,
      fontSize: theme.bodyFontSize,
      color: theme.textColor,
    },
    totalValue: {
      width: 100,
      textAlign: 'right',
      fontSize: theme.bodyFontSize,
      fontWeight: 'bold',
      color: theme.primaryColor,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 50,
      right: 50,
    },
    footerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      paddingTop: 10,
    },
    qrCode: {
      width: 80,
      height: 80,
    },
    signature: {
      width: 150,
      height: 'auto',
      marginBottom: 5,
    },
    notes: {
      fontSize: theme.bodyFontSize - 1,
      fontStyle: 'italic',
      color: theme.secondaryColor,
    },
    watermark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: 60,
      color: `${theme.primaryColor}10`,
      opacity: 0.1,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text>FACTURA</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {formData.empresaLogo && (
              <Image src={formData.empresaLogo} style={styles.logo} />
            )}
            <Text style={styles.title}>FACTURA</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.infoText}>Factura N°: {formData.numeroFactura}</Text>
            <Text style={styles.infoText}>Fecha: {formData.fecha}</Text>
            <Text style={[styles.infoText, { color: theme.accentColor }]}>
              Vencimiento: {formData.vencimiento}
            </Text>
          </View>
        </View>

        {/* Info Sections */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>De</Text>
            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{formData.empresaNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.empresaRNC}</Text>
            <Text style={styles.infoText}>{formData.empresaDireccion}</Text>
            <Text style={styles.infoText}>{formData.empresaEmail}</Text>
            <Text style={styles.infoText}>{formData.empresaTelefono}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Para</Text>
            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{formData.clienteNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.clienteRNC}</Text>
            <Text style={styles.infoText}>{formData.clienteDireccion}</Text>
            <Text style={styles.infoText}>{formData.clienteEmail}</Text>
            <Text style={styles.infoText}>{formData.clienteTelefono}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Descripción</Text>
            <Text style={styles.col2}>Cantidad</Text>
            <Text style={styles.col3}>Precio</Text>
            <Text style={styles.col4}>ITBIS</Text>
            <Text style={styles.col5}>Total</Text>
          </View>
          {formData.items.map((item, index) => (
            <View key={index} style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? theme.backgroundColor : `${theme.primaryColor}05` }
            ]}>
              <Text style={styles.col1}>{item.descripcion}</Text>
              <Text style={styles.col2}>{item.cantidad}</Text>
              <Text style={styles.col3}>
                {formData.moneda} {parseFloat(item.precioUnitario).toFixed(2)}
              </Text>
              <Text style={styles.col4}>
                {formData.moneda} {((parseFloat(item.precioUnitario) * parseFloat(item.cantidad) * parseFloat(item.impuesto)) / 100).toFixed(2)}
              </Text>
              <Text style={styles.col5}>
                {formData.moneda} {(parseFloat(item.precioUnitario) * parseFloat(item.cantidad)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formData.moneda} {formData.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ITBIS:</Text>
            <Text style={styles.totalValue}>
              {formData.moneda} {formData.itbis.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontSize: theme.bodyFontSize + 2 }]}>
              {formData.moneda} {formData.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View>
              <Text style={[styles.infoText, { color: theme.secondaryColor }]}>Notas:</Text>
              <Text style={styles.notes}>{formData.notas}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              {(formData.signature || formData.empresaFirma) && (
                <Image 
                  src={formData.signature || formData.empresaFirma} 
                  style={styles.signature} 
                />
              )}
              <Text style={[styles.infoText, { textAlign: 'center' }]}>Firma Autorizada</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaProfesional; 