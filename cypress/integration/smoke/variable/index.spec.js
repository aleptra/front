describe('Smoke Testing - All (variable)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/variable/index.html')
  })

  context('Checking if variables are executed', () => {

    it('{% baseUrl %}', () => {
      cy.get('#baseurl p').contains('/test/smoke/variable')
    })

    it.skip('{% currentEnvName %}', () => {
      cy.get('#currentEnvName p').contains('')
    })

    it.skip('{% currentEnvUrl %}', () => {
      cy.get('#currentEnvUrl p').contains('/test/smoke/variable')
    })

    it.skip('{% currentPage %}', () => {
      cy.get('#currentPage p').contains('/test/smoke/variable/variable')
    })

    it.skip('{% currentScriptUrl %}', () => {
      cy.get('#currentScriptUrl p').contains('')
    })

    it.skip('{% currentUrl %}', () => {
      cy.get('#currentUrl p').contains('')
    })

    it('{% debugMode %}', () => {
      cy.get('#debugmode p').contains('true')
    })

    it('{% hostname %}', () => {
      cy.get('#hostname p').contains('localhost')
    })

    it.skip('{% mobileMode %}', () => {
      cy.get('#mobilemode p').contains('')
    })

    it('{% startPage %}', () => {
      cy.get('#startpage p').contains('home')
    })

    it('{% title %}', () => {
      cy.get('#title p').contains('Smoke')
    })
  })
})