
describe('GUI Testing - Button', () => {
  it('Opening GUI', () => {
    cy.visit('gui/button.html')
  })

  it('Clicking on button', () => {
    cy.get('main button').click()
  })

  it('Double-clicking on button', () => {
    cy.get('main button').dblclick()
  })
})
