describe('Smoke Testing - decode', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/decode.html')
  })

  it('Checking for decode attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'decode')
    })
  })
})