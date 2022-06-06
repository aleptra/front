describe('Smoke Testing - alert (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/alert.html')
  })

  it('Checking for alert attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'alert')
    })
  })

  it('Checking if alerts are executed', () => {
    cy.reload()
    cy.on('window:alert', (str) => {
      expect(str).to.contains('alert')
    })
  })
})