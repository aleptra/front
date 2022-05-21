
describe('GUI Testing - Select', () => {
  it('Opening GUI', () => {
    cy.visit('gui/select.html')
  })

  it('Choosing options from normal select', () => {
    cy.get('main select').eq(0).select('All')
    cy.get('main select').eq(0).select('Option 1').should('have.value', 'Option 1')
    cy.get('main select').eq(0).select('Option 2').should('have.value', 'Option 2')
  })

  it('Choosing options from outlined select', () => {
    cy.get('main select').eq(1).select('All')
    cy.get('main select').eq(1).select('Option 1').should('have.value', 'Option 1')
    cy.get('main select').eq(1).select('Option 2').should('have.value', 'Option 2')
  })

})
