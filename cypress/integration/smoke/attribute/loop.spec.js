describe('Smoke Testing - iterate (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/loop.html')
  })

  it('Checking for iterate attribute in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'iterate')
    })
  })

  it('Checking if the iteratation is executed 20 times', () => {
    cy.get('#numerical>div>p')
    .should('have.length', 20)
  })

  it('Checking if the iteration has executed variables', () => {
    cy.get('#numerical>div>p')
    .each(($el, $index) => {
      cy.log($index + 1)
      cy.get($el).should('have.text', ($index + 1) + ' = ' + ($index + 1))
    })
  })
})