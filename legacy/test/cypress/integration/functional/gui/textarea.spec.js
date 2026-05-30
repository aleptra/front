
describe('GUI Testing - Textarea', () => {
  it('Opening GUI', () => {
    cy.visit('gui/textarea.html')
  })

  it('Typing in normal textarea', () => {
    cy.get('main textarea').eq(0).type('hello world')
  })

  it('Checking value in normal textarea', () => {
    cy.get('main textarea').eq(0).should('have.value', 'hello world')
  })

  it('Typing in outlined textarea', () => {
    cy.get('main textarea').eq(1).type('hello world')
  })

  it('Checking value in outlined textarea', () => {
    cy.get('main textarea').eq(1).should('have.value', 'hello world')
  })
})
