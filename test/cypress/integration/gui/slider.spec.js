describe('GUI Testing - Slider', () => {
  it('Opening GUI', () => {
    cy.visit('gui/slider.html')
  })

  it('Clicking on slide button 1', () => {
    cy.get('main label').eq(0).click()
  })

  it('Checking if slide 1 is active', () => {
    cy.get("main").within(() => {
      cy.get('input').eq(0).should('be.checked')
      cy.get('input').eq(1).should('not.be.checked')
      cy.get('input').eq(2).should('not.be.checked')
    })
  })

  it('Clicking on slide button 2', () => {
    cy.get('main label').eq(1).click()
  })

  it('Checking if slide 2 is active', () => {
    cy.get("main").within(() => {
      cy.get('input').eq(0).should('not.be.checked')
      cy.get('input').eq(1).should('be.checked')
      cy.get('input').eq(2).should('not.be.checked')
    })
  })

  it('Clicking on slide button 3', () => {
    cy.get('main label').eq(2).click()
  })

  it('Checking if slide 3 is active', () => {
    cy.get("main").within(() => {
      cy.get('input').eq(0).should('not.be.checked')
      cy.get('input').eq(1).should('not.be.checked')
      cy.get('input').eq(2).should('be.checked')
    })
  })

})
