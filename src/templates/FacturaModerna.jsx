import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fuentes
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiGyp8kv8JHgFVrJJLucXtF.ttf', fontWeight: 400, fontStyle: 'italic' }
  ]
});

const FacturaModerna = ({ formData }) => {
  const { theme = {
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headerFontSize: 20,
    bodyFontSize: 9,
  }} = formData;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: theme.backgroundColor,
      fontFamily: 'Poppins',
      position: 'relative'
    },
    header: {
      marginBottom: 25,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: 15
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerLeft: {
      flexDirection: 'column',
    },
    headerRight: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    logo: {
      width: 120,
      height: 'auto',
      marginBottom: 8,
    },
    title: {
      fontSize: theme.headerFontSize,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 8,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 25,
      backgroundColor: `${theme.primaryColor}10`,
      padding: 15,
      borderRadius: 4,
    },
    infoSection: {
      width: '48%',
    },
    sectionTitle: {
      fontSize: theme.bodyFontSize + 2,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 8,
    },
    infoText: {
      fontSize: theme.bodyFontSize,
      marginBottom: 4,
      color: theme.textColor,
    },
    accent: {
      color: theme.secondaryColor,
      fontSize: theme.bodyFontSize + 1,
      fontWeight: 'bold',
    },
    table: {
      marginTop: 15,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.primaryColor,
      padding: 8,
      marginBottom: 4,
      borderRadius: 3,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: `${theme.primaryColor}30`,
      borderBottomStyle: 'solid',
      paddingVertical: 6,
    },
    tableCell: {
      color: theme.textColor,
      fontSize: theme.bodyFontSize,
      padding: 4,
    },
    headerCell: {
      color: 'white',
      fontSize: theme.bodyFontSize,
      fontWeight: 'bold',
      padding: 4,
    },
    col1: { width: '40%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '15%', textAlign: 'right' },
    col4: { width: '15%', textAlign: 'right' },
    col5: { width: '15%', textAlign: 'right' },
    totalsSection: {
      marginTop: 20,
      alignItems: 'flex-end',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 4,
    },
    totalLabel: {
      width: 100,
      textAlign: 'right',
      marginRight: 8,
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
      fontSize: theme.bodyFontSize + 1,
      color: theme.primaryColor,
      fontWeight: 'bold',
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 40,
      right: 40,
      borderTop: `1px solid ${theme.primaryColor}30`,
      paddingTop: 15,
    },
    footerContent: {
      flexDirection: 'column',
      gap: 4,
    },
    footerText: {
      fontSize: theme.bodyFontSize - 1,
      color: theme.textColor,
      textAlign: 'center',
    },
    footerNotes: {
      marginTop: 8,
      fontSize: theme.bodyFontSize - 1,
      color: theme.textColor,
      fontStyle: 'italic',
      textAlign: 'center',
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {formData.empresaLogo && (
                <Image src={formData.empresaLogo} style={styles.logo} />
              )}
              <Text style={styles.title}>FACTURA</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.infoText}>N° {formData.numeroFactura}</Text>
              <Text style={styles.infoText}>Fecha: {formData.fecha}</Text>
              <Text style={styles.infoText}>Vence: {formData.vencimiento}</Text>
            </View>
          </View>
        </View>

        {/* Info Sections */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>De</Text>
            <Text style={[styles.infoText, styles.accent]}>{formData.empresaNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.empresaRNC}</Text>
            <Text style={styles.infoText}>{formData.empresaDireccion}</Text>
            <Text style={styles.infoText}>{formData.empresaEmail}</Text>
            <Text style={styles.infoText}>{formData.empresaTelefono}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Para</Text>
            <Text style={[styles.infoText, styles.accent]}>{formData.clienteNombre}</Text>
            <Text style={styles.infoText}>RNC: {formData.clienteRNC}</Text>
            <Text style={styles.infoText}>{formData.clienteDireccion}</Text>
            <Text style={styles.infoText}>{formData.clienteEmail}</Text>
            <Text style={styles.infoText}>{formData.clienteTelefono}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.col1]}>Descripción</Text>
            <Text style={[styles.headerCell, styles.col2]}>Cantidad</Text>
            <Text style={[styles.headerCell, styles.col3]}>Precio</Text>
            <Text style={[styles.headerCell, styles.col4]}>ITBIS</Text>
            <Text style={[styles.headerCell, styles.col5]}>Total</Text>
          </View>
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.descripcion}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.cantidad}</Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {formData.moneda} {parseFloat(item.precioUnitario).toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {formData.moneda} {((parseFloat(item.precioUnitario) * parseFloat(item.cantidad) * parseFloat(item.impuesto)) / 100).toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.col5]}>
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
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>Total:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              {formData.moneda} {formData.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Método de pago: {formData.metodoPago}
            </Text>
            <Text style={styles.footerText}>
              Condiciones de pago: {formData.condicionesPago}
            </Text>
            {formData.notas && (
              <Text style={styles.footerNotes}>
                Notas: {formData.notas}
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaModerna;