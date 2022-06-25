describe('Smoke Testing - Global variables', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/variable/global.html')
  })

  context('Checking if variables are executed', () => {

    it('{% baseUrl %}', () => {
      cy.get('#baseurl p').contains('/smoke/variable')
    })

    it.skip('{% currentEnvName %}', () => {
      cy.get('#currentEnvName p').contains('')
    })

    it.skip('{% currentEnvUrl %}', () => {
      cy.get('#currentEnvUrl p').contains('/smoke/variable')
    })

    it.skip('{% currentPage %}', () => {
      cy.get('#currentPage p').contains('/smoke/variable/variable')
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

    it('{% hostName %}', () => {
      cy.get('#hostname p').then(($el) => {
        const txt = $el.text()
        cy.location().should((loc) => {
          expect(loc.hostname).to.eq(txt)
        })
      })
    })

    it('{% hostProtocol %}', () => {
      cy.get('#hostprotocol p').then(($el) => {
        const txt = $el.text()
        cy.location().should((loc) => {
          expect(loc.protocol.slice(0, -1)).to.eq(txt)
        })
      })
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