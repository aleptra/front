describe('Smoke Testing - font (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/font.html')
  })

  it('Checking for font attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('p').should('have.attr', 'font')
    })
  })

  it('Checking if font attribute is executed in elements', () => {
    cy.get("main").within(() => {
      cy.get('p').eq(0).should('have.css', 'font-family')
      .and('match', /Arial/)
      cy.get('p').eq(1).should('have.css', 'font-family')
      .and('match', /Helvetica/)
      cy.get('p').eq(2).should('have.css', 'font-family')
      .and('match', /sans-serif/)
      cy.get('p').eq(3).should('have.css', 'font-family')
      .and('match', /Times/)
      cy.get('p').eq(4).should('have.css', 'font-family')
      .and('match', /Times New Roman/)
    })
  })
})