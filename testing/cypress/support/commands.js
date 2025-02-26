// Comando para rellenar el formulario del emisor
Cypress.Commands.add('fillEmisorForm', (emisorData = {}) => {
  const defaultData = {
    empresaNombre: 'Empresa de Prueba',
    empresaRNC: '123456789',
    empresaEmail: 'test@empresa.com',
    empresaTelefono: '809-555-5555',
    empresaDireccion: 'Calle Principal #123, Ciudad'
  };

  const data = { ...defaultData, ...emisorData };

  cy.get('[name="empresaNombre"]').clear().type(data.empresaNombre);
  cy.get('[name="empresaRNC"]').clear().type(data.empresaRNC);
  cy.get('[name="empresaEmail"]').clear().type(data.empresaEmail);
  cy.get('[name="empresaTelefono"]').clear().type(data.empresaTelefono);
  cy.get('[name="empresaDireccion"]').clear().type(data.empresaDireccion);
});

// Comando para rellenar el formulario del cliente
Cypress.Commands.add('fillClienteForm', (clienteData = {}) => {
  const defaultData = {
    clienteNombre: 'Cliente de Prueba',
    clienteRNC: '987654321',
    clienteEmail: 'test@cliente.com',
    clienteTelefono: '809-555-5556',
    clienteDireccion: 'Avenida Secundaria #456, Ciudad'
  };

  const data = { ...defaultData, ...clienteData };

  cy.get('[name="clienteNombre"]').clear().type(data.clienteNombre);
  cy.get('[name="clienteRNC"]').clear().type(data.clienteRNC);
  cy.get('[name="clienteEmail"]').clear().type(data.clienteEmail);
  cy.get('[name="clienteTelefono"]').clear().type(data.clienteTelefono);
  cy.get('[name="clienteDireccion"]').clear().type(data.clienteDireccion);
});

// Comando para rellenar los detalles de la factura
Cypress.Commands.add('fillFacturaDetails', (facturaData = {}) => {
  const defaultData = {
    moneda: 'USD',
    metodoPago: 'Transferencia',
    condicionesPago: 'Contado'
  };

  const data = { ...defaultData, ...facturaData };

  // Función auxiliar para seleccionar una opción del dropdown
  const selectOption = (fieldName, value) => {
    cy.get(`[name="${fieldName}"]`)
      .parent()
      .click()
      .then(() => {
        cy.get('.MuiMenu-paper .MuiMenuItem-root')
          .contains(value)
          .click();
      });
  };

  // Seleccionar opciones con retraso entre cada una
  selectOption('moneda', data.moneda);
  cy.wait(500); // Esperar a que se cierre el menú anterior
  selectOption('metodoPago', data.metodoPago);
  cy.wait(500);
  selectOption('condicionesPago', data.condicionesPago);
});

// Comando para agregar un item a la factura
Cypress.Commands.add('addFacturaItem', (itemData = {}) => {
  const defaultData = {
    descripcion: 'Producto de prueba',
    cantidad: '1',
    precioUnitario: '100',
    impuesto: '18',
    descuento: '0'
  };

  const data = { ...defaultData, ...itemData };

  // Esperar a que los campos estén disponibles
  cy.get('[name="descripcion"]').last().should('be.visible');

  // Usar {force: true} para campos que podrían estar cubiertos
  cy.get('[name="descripcion"]').last().clear().type(data.descripcion, { force: true });
  cy.get('[name="cantidad"]').last().clear().type(data.cantidad, { force: true });
  cy.get('[name="precioUnitario"]').last().clear().type(data.precioUnitario, { force: true });
  cy.get('[name="impuesto"]').last().clear().type(data.impuesto, { force: true });
  cy.get('[name="descuento"]').last().clear().type(data.descuento, { force: true });
});

// Comando para verificar los totales
Cypress.Commands.add('checkTotals', (expectedTotals) => {
  cy.contains('Subtotal:').parent().contains(expectedTotals.subtotal);
  cy.contains('ITBIS:').parent().contains(expectedTotals.itbis);
  cy.contains('Total:').parent().contains(expectedTotals.total);
}); 