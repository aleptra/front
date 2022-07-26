describe('GUI Testing - Slider', () => {
  it('Opening GUI', () => {
    cy.visit('gui/slider.html')
  })

  context('Slide 1', () => {
    it('Clicking on slide button', () => {
      cy.get('main label').eq(0).click()
    })

    it('Checking if slide is active', () => {
      cy.get("main").within(() => {
        cy.get('input').eq(0).should('be.checked')
        cy.get('input').eq(1).should('not.be.checked')
        cy.get('input').eq(2).should('not.be.checked')
      })
    })
  })

  context('Slide 2', () => {
    it('Clicking on slide button', () => {
      cy.get('main label').eq(1).click()
    })

    it('Checking if slide is active', () => {
      cy.get("main").within(() => {
        cy.get('input').eq(0).should('not.be.checked')
        cy.get('input').eq(1).should('be.checked')
        cy.get('input').eq(2).should('not.be.checked')
      })
    })
  })

  context('Slide 3', () => {
    it('Clicking on slide button', () => {
      cy.get('main label').eq(2).click()
    })

    it('Checking if slide is active', () => {
      cy.get("main").within(() => {
        cy.get('input').eq(0).should('not.be.checked')
        cy.get('input').eq(1).should('not.be.checked')
        cy.get('input').eq(2).should('be.checked')
      })
    })
  })

})