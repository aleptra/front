describe('GUI Testing - Textfield', () => {
  it('Opening GUI', () => {
    cy.visit('gui/textfield.html')
  })

  it('Typing in normal textfield', () => {
    cy.get('main input').eq(0).type('hello world')
  })

  it('Checking value in normal textfield', () => {
    cy.get('main input').eq(0).should('have.value', 'hello world')
  })

  it('Typing in outlined textfield', () => {
    cy.get('main input').eq(1).type('hello world')
  })

  it('Checking value in outlined textfield', () => {
    cy.get('main input').eq(1).should('have.value', 'hello world')
  })
})
