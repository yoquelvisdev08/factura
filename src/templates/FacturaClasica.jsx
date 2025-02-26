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

const FacturaClasica = ({ formData }) => {
  const { theme = {
    primaryColor: '#F59E0B',
    secondaryColor: '#FBBF24',
    accentColor: '#D97706',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headerFontSize: 24,
    bodyFontSize: 10,
  }} = formData;

  const styles = StyleSheet.create({
    page: {
      padding: 50,
      backgroundColor: theme.backgroundColor,
      fontFamily: 'Poppins'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: 20
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
      padding: 15,
      backgroundColor: `${theme.primaryColor}05`,
      borderRadius: 5,
      borderLeft: `4px solid ${theme.primaryColor}`,
    },
    sectionTitle: {
      fontSize: theme.bodyFontSize + 2,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 10,
    },
    infoText: {
      fontSize: theme.bodyFontSize,
      marginBottom: 5,
      color: theme.textColor,
    },
    table: {
      marginTop: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.primaryColor,
      padding: 8,
      marginBottom: 5,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: `${theme.primaryColor}20`,
      borderBottomStyle: 'solid',
      padding: 8,
    },
    tableCell: {
      color: theme.textColor,
      fontSize: theme.bodyFontSize,
    },
    headerCell: {
      color: 'white',
      fontSize: theme.bodyFontSize,
      fontWeight: 'bold',
    },
    col1: { width: '40%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '15%', textAlign: 'right' },
    col4: { width: '15%', textAlign: 'right' },
    col5: { width: '15%', textAlign: 'right' },
    totalsSection: {
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
      color: theme.textColor,
      fontSize: theme.bodyFontSize,
    },
    totalValue: {
      width: 100,
      textAlign: 'right',
      color: theme.primaryColor,
      fontSize: theme.bodyFontSize,
      fontWeight: 'bold',
    },
    grandTotal: {
      fontSize: theme.bodyFontSize + 2,
      color: theme.primaryColor,
      fontWeight: 'bold',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      color: theme.textColor,
      fontSize: theme.bodyFontSize - 2,
      borderTop: `1px solid ${theme.primaryColor}20`,
      paddingTop: 20,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
            <Text style={styles.infoText}>Vencimiento: {formData.vencimiento}</Text>
          </View>
        </View>

        {/* Info Sections */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>DATOS DEL EMISOR</Text>
            <Text style={styles.infoText}>{formData.empresaNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.empresaRNC}</Text>
            <Text style={styles.infoText}>{formData.empresaDireccion}</Text>
            <Text style={styles.infoText}>{formData.empresaEmail}</Text>
            <Text style={styles.infoText}>{formData.empresaTelefono}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
            <Text style={styles.infoText}>{formData.clienteNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.clienteRNC}</Text>
            <Text style={styles.infoText}>{formData.clienteDireccion}</Text>
            <Text style={styles.infoText}>{formData.clienteEmail}</Text>
            <Text style={styles.infoText}>{formData.clienteTelefono}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.headerCell]}>Descripción</Text>
            <Text style={[styles.col2, styles.headerCell]}>Cantidad</Text>
            <Text style={[styles.col3, styles.headerCell]}>Precio</Text>
            <Text style={[styles.col4, styles.headerCell]}>ITBIS</Text>
            <Text style={[styles.col5, styles.headerCell]}>Total</Text>
          </View>
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.col1, styles.tableCell]}>{item.descripcion}</Text>
              <Text style={[styles.col2, styles.tableCell]}>{item.cantidad}</Text>
              <Text style={[styles.col3, styles.tableCell]}>
                {formData.moneda} {parseFloat(item.precioUnitario).toFixed(2)}
              </Text>
              <Text style={[styles.col4, styles.tableCell]}>
                {formData.moneda} {((parseFloat(item.precioUnitario) * parseFloat(item.cantidad) * parseFloat(item.impuesto)) / 100).toFixed(2)}
              </Text>
              <Text style={[styles.col5, styles.tableCell]}>
                {formData.moneda} {(parseFloat(item.precioUnitario) * parseFloat(item.cantidad)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
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
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontWeight: 'bold' }]}>
              {formData.moneda} {formData.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.infoText}>
            Método de pago: {formData.metodoPago}
          </Text>
          <Text style={styles.infoText}>
            Condiciones de pago: {formData.condicionesPago}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaClasica;