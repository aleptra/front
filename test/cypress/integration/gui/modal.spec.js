describe('GUI Testing - Modal', () => {
  it('Opening GUI', () => {
    cy.visit('gui/modal.html')
  })

  it('Checking for link name', () => {
    cy.get('main a').contains('Link')
  })

  it("Checking for anchor tag in link", () => {
    cy.get('main a').should('have.attr', 'href', '#test')
  })

  it('Opening modal', () => {
    cy.get('main a').click()
  })

  it("Checking for anchor in url", () => {
    cy.url().should('include', '#test')
  })
})
