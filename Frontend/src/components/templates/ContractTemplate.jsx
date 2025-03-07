import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

// Estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3f51b5',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 30,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  clauseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clauseContent: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 15,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureBox: {
    width: '40%',
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    marginTop: 10,
    marginHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
  }
});

const formatDate = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (e) {
    return '';
  }
};

const ContractTemplate = ({ templateData }) => {
  const {
    title = 'CONTRATO DE PRESTACIÓN DE SERVICIOS',
    partyA = '',
    partyAId = '',
    partyAAddress = '',
    partyB = '',
    partyBId = '',
    partyBAddress = '',
    exposition = '',
    clauses = [],
    place = '',
    contractDate = new Date(),
  } = templateData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.subtitle}>REUNIDOS</Text>
        <View style={styles.section}>
          <Text style={styles.text}>
            De una parte, <Text style={styles.bold}>{partyA}</Text>, con CIF/NIF <Text style={styles.bold}>{partyAId}</Text> y domicilio en <Text style={styles.bold}>{partyAAddress}</Text>, en adelante "EL PROVEEDOR".
          </Text>
          <Text style={styles.text}>
            Y de otra parte, <Text style={styles.bold}>{partyB}</Text>, con CIF/NIF <Text style={styles.bold}>{partyBId}</Text> y domicilio en <Text style={styles.bold}>{partyBAddress}</Text>, en adelante "EL CLIENTE".
          </Text>
        </View>
        
        <Text style={styles.subtitle}>EXPONEN</Text>
        <View style={styles.section}>
          <Text style={styles.text}>{exposition || 'Que ambas partes están interesadas en formalizar el presente contrato con arreglo a las siguientes cláusulas:'}</Text>
        </View>
        
        <Text style={styles.subtitle}>CLÁUSULAS</Text>
        <View style={styles.section}>
          {clauses.map((clause, index) => (
            <View key={index}>
              <Text style={styles.clauseTitle}>CLÁUSULA {index + 1}: {clause.title}</Text>
              <Text style={styles.clauseContent}>{clause.content}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>
            Y en prueba de conformidad, firman el presente documento por duplicado, en {place}, a {formatDate(contractDate)}.
          </Text>
        </View>
        
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Firma de EL PROVEEDOR</Text>
            <View style={styles.signatureLine} />
            <Text style={[styles.text, { textAlign: 'center', marginTop: 5 }]}>{partyA}</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Firma de EL CLIENTE</Text>
            <View style={styles.signatureLine} />
            <Text style={[styles.text, { textAlign: 'center', marginTop: 5 }]}>{partyB}</Text>
          </View>
        </View>
        
        <Text style={styles.footer}>Este documento es confidencial y contiene información privilegiada.</Text>
      </Page>
    </Document>
  );
};

export default ContractTemplate; 