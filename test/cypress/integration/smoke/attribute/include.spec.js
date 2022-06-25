describe('Smoke Testing - include (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/include.html')
  })

  /*
  it('Checking for include attribute in element', () => {
    cy.get("main").within(() => {
      cy.get('div').eq(0).should('have.attr', 'include')
      cy.get('div').eq(1).should('have.attr', 'include')
    })
  })
  */

  it('Checking if include attribute is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').eq(0).contains('Copybook 1')
      cy.get('div').eq(1).contains('Copybook 2')
    })
  })
})