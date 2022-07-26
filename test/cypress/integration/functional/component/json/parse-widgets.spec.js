describe('Component Testing - Parsing Single JSON Data', () => {
  it('Opening GUI', () => {
    cy.visit('library/json/parse-widgets.html')
  })

  it('Checking for jsonget attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('input').should('have.attr', 'jsonget')
      cy.get('select').should('have.attr', 'jsonget')
      cy.get('a').should('have.attr', 'jsonget')
    })
  })

  it('Checking for parsed values', () => {
    cy.get("main").within(() => {
    })
  })
})