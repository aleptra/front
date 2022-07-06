describe('Component Testing - Navigation', () => {
  it('Opening GUI', () => {
    cy.visit('library/nav/index.html')
  })

  context('Page 1', () => {
    it('Clicking on link', () => {
      cy.get("nav").within(() => {
        cy.get('a').eq(0).click()
      })
    })
    it('Checking if page loaded', () => {
      cy.get("main h1").contains('Page 1')
    })
  })

  context('Page 2', () => {
    it('Clicking on link', () => {
      cy.get("nav").within(() => {
        cy.get('a').eq(1).click()
      })
    })
    it('Checking if page loaded', () => {
      cy.get("main h1").contains('Page 2')
    })
  })
})