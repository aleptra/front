describe('Smoke Testing - decode (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/decode.html')
  })

  it('Checking for decode attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'decode')
    })
  })
})