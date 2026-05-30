describe('Smoke Testing - Library variables', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/variable/library.html?locale=en')
  })

  context('Checking if variables are executed', () => {

    it('{% browserLocale %}', () => {
      cy.get('#browserlocale p').should('not.be.empty')
    })

    it('{% defaultlocale %}', () => {
      cy.get('#defaultlocale p').should('not.be.empty')
    })

    it('{% localecode %}', () => {
      cy.get('#localecode p').should('not.be.empty')
    })

    it('{% defaultlocale %}', () => {
      cy.get('#defaultlocale p').should('not.be.empty')
    })
  })
})