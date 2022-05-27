
describe('Smoke Testing - include', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/include.html')
  })

  /*
  it('Checking for include attribute in element', () => {
    cy.get('main div').eq(0).should('have.attr', 'include')
    cy.get('main div').eq(1).should('have.attr', 'include')
  })
  */

  it('Checking if include attribute is executed in elements', () => {
    cy.get('main div').eq(0).contains('Copybook 1')
    cy.get('main div').eq(1).contains('Copybook 2')
  })
})