describe('Smoke Testing - Special variables', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/variable/special.html?variable=value')
  })

  context('Checking if variables are executed', () => {

    it('{# ?variable #}', () => {
      cy.get('#querystring p').contains('value')
    })
  })
})