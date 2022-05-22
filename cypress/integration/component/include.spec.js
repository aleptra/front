
describe('Component Testing - Include', () => {
  it('Opening GUI', () => {
    cy.visit('core/include/index.html')
  })

  /*it('Checking for include attributes', () => {
    cy.get('main div').eq(0).should('have.attr', 'include')
    cy.get('main div').eq(1).should('have.attr', 'include')
  })*/

  it('Checking for included copybooks', () => {
    cy.get('main div').eq(0).contains('Copybook 1')
    cy.get('main div').eq(1).contains('Copybook 2')
  })

})
