
describe('Open To Do Application', () => {
  it('Clear Cache', () => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Visit To Do Application', () => {
    cy.visit('/marketplace/app/todo')
  })
})
