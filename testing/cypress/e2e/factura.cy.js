describe('Factura App', () => {
  beforeEach(() => {
    cy.visit('/factura-rapida');
    // Wait for the page to load completely
    cy.get('.MuiStepper-root', { timeout: 10000 }).should('exist');
  });

  it('should create a complete invoice', () => {
    // Paso 1: Datos del Emisor
    cy.fillEmisorForm();
    cy.get('[name="empresaNombre"]').should('have.value', 'Empresa de Prueba');
    cy.get('button').contains('Siguiente').click();

    // Paso 2: Datos del Cliente
    cy.fillClienteForm();
    cy.get('[name="clienteNombre"]').should('have.value', 'Cliente de Prueba');
    cy.get('button').contains('Siguiente').click();

    // Paso 3: Detalles de la Factura
    cy.fillFacturaDetails();
    // Verificar que los campos select tienen los valores correctos
    cy.get('[name="moneda"]').should('exist');
    cy.get('button').contains('Siguiente').click();

    // Paso 4: Agregar Items
    cy.get('button').contains('Agregar Item').should('be.visible').click();
    cy.addFacturaItem({
      descripcion: 'Servicio de Consultoría',
      cantidad: '10',
      precioUnitario: '150',
      impuesto: '18',
      descuento: '5'
    });

    // Verificar que el primer item se agregó correctamente
    cy.get('.MuiGrid-container').first().within(() => {
      cy.get('[name="descripcion"]').should('have.value', 'Servicio de Consultoría');
      cy.get('[name="cantidad"]').should('have.value', '10');
    });

    cy.get('button').contains('Agregar Item').click();
    cy.addFacturaItem({
      descripcion: 'Desarrollo de Software',
      cantidad: '1',
      precioUnitario: '2000',
      impuesto: '18',
      descuento: '0'
    });

    // Verificar cálculos en tiempo real
    cy.contains('Subtotal:').parent().contains('3,500.00');
    cy.contains('ITBIS:').parent().contains('630.00');
    cy.contains('Total:').parent().contains('4,130.00');

    cy.get('button').contains('Siguiente').click();

    // Paso 5: Verificar Totales y Generar PDF
    cy.contains('Resumen de Totales').parent().within(() => {
      cy.contains('Subtotal:').parent().contains('3,500.00');
      cy.contains('ITBIS:').parent().contains('630.00');
      cy.contains('Total:').parent().contains('4,130.00');
    });

    // Verificar vista previa y generación de PDF
    cy.get('button').contains('Vista Previa').click();
    cy.get('.MuiDialog-root').should('be.visible');
    cy.get('.MuiDialog-paper').should('be.visible');
    cy.get('button').contains('Cerrar').click();
    
    cy.get('button').contains('Generar PDF').should('be.enabled');
  });

  it('should validate required fields', () => {
    // Verificar validación inicial
    cy.get('button').contains('Siguiente').click();
    cy.get('.MuiFormHelperText-root').should('be.visible');

    // Verificar validación parcial
    cy.get('[name="empresaNombre"]').type('Empresa Test');
    cy.get('button').contains('Siguiente').click();
    cy.get('.MuiFormHelperText-root').should('be.visible');
  });

  it('should calculate totals correctly with different scenarios', () => {
    // Navegar hasta la sección de items
    cy.fillEmisorForm();
    cy.get('button').contains('Siguiente').click();
    cy.fillClienteForm();
    cy.get('button').contains('Siguiente').click();
    cy.fillFacturaDetails();
    cy.get('button').contains('Siguiente').click();

    // Escenario 1: Item sin descuento
    cy.get('button').contains('Agregar Item').click();
    cy.addFacturaItem({
      descripcion: 'Producto Test 1',
      cantidad: '2',
      precioUnitario: '100',
      impuesto: '18',
      descuento: '0'
    });

    cy.contains('Subtotal:').parent().contains('200.00');
    cy.contains('ITBIS:').parent().contains('36.00');
    cy.contains('Total:').parent().contains('236.00');

    // Escenario 2: Item con descuento
    cy.get('button').contains('Agregar Item').click();
    cy.addFacturaItem({
      descripcion: 'Producto Test 2',
      cantidad: '1',
      precioUnitario: '200',
      impuesto: '18',
      descuento: '10'
    });

    // Verificar totales actualizados
    cy.contains('Subtotal:').parent().contains('400.00');
    cy.contains('ITBIS:').parent().contains('72.00');
    cy.contains('Total:').parent().contains('472.00');
  });
}); 