
describe('GUI Testing - Button', () => {
  it('Open GUI', () => {
    cy.visit('gui/button.html')
  })

  it('Clear Cache', () => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
})
