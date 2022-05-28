describe('Smoke Testing - trim', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/trim.html')
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
      cy.get('div', { timeout: 0 }).should('have.text', 'div trim')
      cy.get('p', { timeout: 0 }).should('have.text', 'p trim')
      cy.get('span', { timeout: 0 }).contains('span trim')
    })
  })
})