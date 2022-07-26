describe('Smoke Testing - format (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/format.html')
  })

  it('Checking for format attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('p').should('have.attr', 'format')
    })
  })

  context('Checking if format is executed in elements', () => {
    const age = ~~((Date.now() - 546739200000) / (31557600000))
    const date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let fullDate = date.getFullYear() + "-" + (month) + "-" + (day);

    it('Without values', () => {
      cy.get("main #novalues").within(() => {
        cy.get('p').eq(0).should('have.text', fullDate)
        cy.get('p').eq(1).should('have.text', year)
        cy.get('p').eq(2).should('have.text', month)
        cy.get('p').eq(3).should('have.text', day)
      })
    })
    it('With values', () => {
      cy.get("main #values").within(() => {
        cy.get('p').eq(0).should('have.text', '1987-04-30')
        cy.get('p').eq(1).should('have.text', '1987-04-30')
        cy.get('p').eq(2).should('have.text', '1987-04-30')
        cy.get('p').eq(3).should('have.text', '1987')
        cy.get('p').eq(4).should('have.text', '04')
        cy.get('p').eq(5).should('have.text', '30')
        cy.get('p').eq(6).should('have.text', age)
      })
    })
  })
})