describe('Component Testing - Navigation', () => {
  it('Opening GUI', () => {
    cy.visit('library/nav/index.html')
  })

  context('Page 3', () => {
    it('Clicking on link', () => {
      cy.get('nav').within(() => {
        cy.get('a').eq(2).click()
      })
    })
    it('Checking if page loaded', () => {
      cy.get('main h1').contains('page 3')
    })
    it('Scrolling to bottom', () => {
      cy.get('main').scrollTo('bottom')
      cy.get('main').invoke('scrollTop').should('not.eq', 0)
    })
  })

  context('Page 2', () => {
    it('Clicking on link', () => {
      cy.get('nav').within(() => {
        cy.get('a').eq(1).click()
      })
    })
    it('Checking if page loaded', () => {
      cy.get('main h1').contains('Page 2')
    })
    it('Checking if scroll is reset', () => {
      cy.get('main').invoke('scrollTop').should('eq', 0)
    })
  })

  context('Page 1', () => {
    it('Clicking on link', () => {
      cy.get('nav').within(() => {
        cy.get('a').eq(0).click()
      })
    })
    it('Checking if page loaded', () => {
      cy.get('main h1').contains('Page 1')
    })
    it('Checking if scroll is reset', () => {
      cy.get('main').invoke('scrollTop').should('eq', 0)
    })
  })
})