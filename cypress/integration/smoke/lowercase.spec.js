describe('Smoke Testing - lowercase', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/lowercase.html')
  })

  it('Checking for lowercase attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'lowercase')
      cy.get('p').should('have.attr', 'lowercase')
      cy.get('span').should('have.attr', 'lowercase')
    })
  })

  it('Checking if lowercase is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.text', 'lowercase')
      cy.get('p').should('have.text', 'lowercase')
      cy.get('span').contains('lowercase')
    })
  })
})