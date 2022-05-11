
describe('GUI Testing - Button', () => {
  it('Open GUI', () => {
    cy.visit('gui/button.html')
  })

  it('Click on button', () => {
    cy.get('#button1').click()
  })

  it('Double-click on button', () => {
    cy.get('#button1').dblclick()
  })
})
