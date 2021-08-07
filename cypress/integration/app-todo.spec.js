
describe('To Do Application', () => {
  it('Clear Cache', () => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Visit Application', () => {
    cy.visit('/marketplace/app/todo')
  })
})
