describe('Component Testing - Parsing Single JSON Data', () => {
  it('Opening GUI', () => {
    cy.visit('library/json/parsesingle.html')
  })

  it('Checking for jsonget attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'jsonget')
    })
  })

  it('Checking for parsed values', () => {
    cy.get("main").within(() => {
      cy.get('div').eq(0).should('have.text', '1')
      cy.get('div').eq(1).should('have.text', 'First name')
      cy.get('div').eq(2).should('have.text', 'Middle name')
      cy.get('div').eq(3).should('have.text', 'Last name')
      cy.get('div').eq(4).should('have.text', 'Nickname')
    })
  })
})