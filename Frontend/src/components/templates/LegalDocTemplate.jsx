import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' }
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
    marginBottom: 30,
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 40,
  },
  recipient: {
    marginBottom: 30,
  },
  recipientText: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 12,
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 30,
  },
  farewell: {
    fontSize: 12,
    marginTop: 40,
    marginBottom: 5,
  },
  signature: {
    marginTop: 50,
  },
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  signatureContact: {
    fontSize: 11,
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
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

const LegalDocTemplate = ({ templateData }) => {
  const {
    title = 'DOCUMENTO LEGAL',
    place = '',
    date = new Date(),
    recipient = '',
    recipientPosition = '',
    recipientCompany = '',
    recipientAddress = '',
    greeting = 'Estimado/a Sr./Sra.:',
    content = '',
    farewell = 'Atentamente,',
    sender = '',
    senderPosition = '',
    senderCompany = '',
    senderContact = ''
  } = templateData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.date}>{place ? `${place}, ` : ''}{formatDate(date)}</Text>
        
        {recipient && (
          <View style={styles.recipient}>
            <Text style={styles.recipientText}>{recipient}</Text>
            {recipientPosition && <Text style={styles.recipientText}>{recipientPosition}</Text>}
            {recipientCompany && <Text style={styles.recipientText}>{recipientCompany}</Text>}
            {recipientAddress && <Text style={styles.recipientText}>{recipientAddress}</Text>}
          </View>
        )}
        
        <Text style={styles.greeting}>{greeting}</Text>
        
        <Text style={styles.content}>{content}</Text>
        
        <Text style={styles.farewell}>{farewell}</Text>
        
        <View style={styles.signature}>
          <Text style={styles.signatureText}>{sender}</Text>
          {senderPosition && <Text style={styles.signatureContact}>{senderPosition}</Text>}
          {senderCompany && <Text style={styles.signatureContact}>{senderCompany}</Text>}
          {senderContact && <Text style={styles.signatureContact}>{senderContact}</Text>}
        </View>
        
        <Text style={styles.footer}>Este documento es confidencial y contiene información privilegiada.</Text>
      </Page>
    </Document>
  );
};

export default LegalDocTemplate; 