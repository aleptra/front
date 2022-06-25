describe('Smoke Testing - slice (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/slice.html')
  })

  it('Checking for slice attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'slice')
      cy.get('p').should('have.attr', 'slice')
      cy.get('span').should('have.attr', 'slice')
    })
  })

  it('Checking if slice is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.text', 'div slice')
      cy.get('p').should('have.text', 'ice')
      cy.get('span').contains('slice')
    })
  })
})