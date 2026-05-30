describe('GUI Testing - Button', () => {
  it('Opening GUI', () => {
    cy.visit('gui/button.html')
  })

  it('Clicking on enabled button', () => {
    cy.get('main #enabled button').click()
  })

  it('Clicking on disabled button', () => {
    cy.get('main #disabled button').should('be.disabled').click({force:true})
  })

  it('Double-clicking on enabled button', () => {
    cy.get('main #enabled button').dblclick()
  })

  it('Double-clicking on disabled button', () => {
    cy.get('main #disabled button').should('be.disabled').dblclick({force:true})
  })
})
