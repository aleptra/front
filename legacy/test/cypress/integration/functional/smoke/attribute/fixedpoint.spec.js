describe('Smoke Testing - fixedpoint (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/fixedpoint.html')
  })

  it('Checking for fixedpoint attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('span').should('have.attr', 'fixedpoint')
    })
  })

  it('Checking if fixedpoint is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('span').eq(0).should('have.text', '1000.000')
      cy.get('span').eq(1).should('have.text', '100.00')
      cy.get('span').eq(2).should('have.text', '100.0')
      cy.get('span').eq(3).should('have.text', '1.000')
      cy.get('span').eq(4).should('have.text', '1.00')
      cy.get('span').eq(5).should('have.text', '1.0')
      cy.get('span').eq(6).should('have.text', '1')
      cy.get('span').eq(7).should('have.text', '1')
    })
  })
})