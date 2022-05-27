
describe('Smoke Testing - afterbegin', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/afterbegin.html')
  })

  it('Checking for afterbegin attribute in elements', () => {
    cy.get('main button').should('have.attr', 'afterbegin')
    cy.get('main div').should('have.attr', 'afterbegin')
    cy.get('main span').should('have.attr', 'afterbegin')
    cy.get('main p').should('have.attr', 'afterbegin')
    cy.get('main h1').should('have.attr', 'afterbegin')
    cy.get('main h2').should('have.attr', 'afterbegin')
    cy.get('main h3').should('have.attr', 'afterbegin')
    cy.get('main h4').should('have.attr', 'afterbegin')
    cy.get('main h5').should('have.attr', 'afterbegin')
    cy.get('main h6').should('have.attr', 'afterbegin')
  })

  it('Checking if afterbegin attribute is executed in elements', () => {
    cy.get('main button').contains('[OK]')
    cy.get('main div').contains('[OK]')
    cy.get('main span').contains('[OK]')
    cy.get('main p').contains('[OK]')
    cy.get('main h1').contains('[OK]')
    cy.get('main h2').contains('[OK]')
    cy.get('main h3').contains('[OK]')
    cy.get('main h4').contains('[OK]')
    cy.get('main h5').contains('[OK]')
    cy.get('main h6').contains('[OK]')
  })
})