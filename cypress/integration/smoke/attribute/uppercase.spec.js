describe('Smoke Testing - uppercase (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/uppercase.html')
  })

  it('Checking for uppercase attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'uppercase')
      cy.get('p').should('have.attr', 'uppercase')
      cy.get('span').should('have.attr', 'uppercase')
    })
  })

  it('Checking if uppercase is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.text', 'UPPERCASE')
      cy.get('p').should('have.text', 'UPPERCASE')
      cy.get('span').contains('UPPERCASE')
    })
  })
})