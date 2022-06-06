describe('Smoke Testing - format (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/format.html')
  })

  it('Checking for format attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('span').should('have.attr', 'format')
    })
  })

  it('Checking if format is executed in elements', () => {
    const age = ~~((Date.now() - 546739200000) / (31557600000))
    cy.get("main").within(() => {
      cy.get('span').eq(0).should('have.text', '1987-04-30')
      cy.get('span').eq(1).should('have.text', '1987-04-30')
      cy.get('span').eq(2).should('have.text', '1987-04-30')
      cy.get('span').eq(3).should('have.text', '1987')
      cy.get('span').eq(4).should('have.text', '04')
      cy.get('span').eq(5).should('have.text', '30')
      cy.get('span').eq(6).should('have.text', age)
    })
  })
})