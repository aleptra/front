describe('GUI Testing - Modal', () => {
  it('Opening GUI', () => {
    cy.visit('gui/modal.html')
  })

  it("Checking for anchor tags in links", () => {
    cy.get("main").within(() => {
      cy.get('#inline a').eq(0).should('have.attr', 'href', '#inlinemodal')
      cy.get('#ajax a').eq(0).should('have.attr', 'href', '#ajaxmodal')
    })
  })

  it('Opening inline modal', () => {
    cy.get('main #inline a').eq(0).click()
  })

  it("Checking for inline anchor in url", () => {
    cy.url().should('include', '#inlinemodal')
  })

  it('Opening ajax modal', () => {
    cy.get('main #ajax a').eq(0).click()
  })

  it("Checking for ajax anchor in url", () => {
    cy.url().should('include', '#ajaxmodal')
  })
})
