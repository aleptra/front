
describe('GUI Testing - Button', () => {
  it('Opening GUI', () => {
    cy.visit('gui/button.html')
  })

  it('Clicking on button', () => {
    cy.get('#button1').click()
  })

  it('Double-clicking on button', () => {
    cy.get('#button1').dblclick()
  })
})
