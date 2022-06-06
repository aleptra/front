describe('Smoke Testing - escape (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/escape.html')
  })

  it('Checking for escape attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'escape')
    })
  })

  it('Checking if escape is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.text', '&#35;')
    })
  })
})