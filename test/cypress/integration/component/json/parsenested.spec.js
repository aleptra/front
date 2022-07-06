describe('Component Testing - Parsing Nested JSON Data', () => {
  it('Opening GUI', () => {
    cy.visit('library/json/parsenested.html')
  })

  it('Checking for jsonget attribute in elements', () => {
    cy.get("main div").within(() => {
      cy.get('b').should('have.attr', 'jsonget')
      cy.get('span').should('have.attr', 'jsonget')
      cy.get('p').should('have.attr', 'jsonget')
    })
  })

  it('Checking if the iteratation is executed 20 times', () => {
    cy.get('main div')
    .should('have.length', 20)
  })

  it('Checking if the iteration has parsed values', () => {
    cy.get('main div span')
    .each(($el, $index) => {
      cy.get($el).should('have.text', 'Todo ' + ($index + 1))
    })
    cy.get('main div p')
    .each(($el) => {
      cy.get($el).should('have.text', 'true')
    })
  })
})