describe('Smoke Testing - trim (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/trim.html')
  })

  it('Checking for trim attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'trim')
      cy.get('p').should('have.attr', 'trim')
      cy.get('span').should('have.attr', 'trim')
    })
  })

  it('Checking if trim attribute is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.text', 'div trim')
      cy.get('p').should('have.text', 'p trim')
      cy.get('span').contains('span trim')
    })
  })
})