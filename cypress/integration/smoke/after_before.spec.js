
describe('Smoke Testing - after & before', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/after_before.html')
  })

  it('Checking for afterbegin attribute in elements', () => {
    cy.get("main #afterbegin").within(() => {
      cy.get("button").should('have.attr', 'afterbegin')
      cy.get('div').should('have.attr', 'afterbegin')
      cy.get('span').should('have.attr', 'afterbegin')
      cy.get('p').should('have.attr', 'afterbegin')
      cy.get('h1').should('have.attr', 'afterbegin')
      cy.get('h2').should('have.attr', 'afterbegin')
      //cy.get('h3').should('have.attr', 'afterbegin') // Cypress bugg
      cy.get('h4').should('have.attr', 'afterbegin')
      cy.get('h5').should('have.attr', 'afterbegin')
      cy.get('h6').should('have.attr', 'afterbegin')
    })
  })

  it('Checking if afterbegin attribute is executed in elements', () => {
    cy.get("main #afterbegin").within(() => {
      cy.get('button').contains('[OK]')
      cy.get('div').contains('[OK]')
      cy.get('span').contains('[OK]')
      cy.get('p').contains('[OK]')
      cy.get('h1').contains('[OK]')
      cy.get('h2').contains('[OK]')
      cy.get('h3').contains('[OK]')
      cy.get('h4').contains('[OK]')
      cy.get('h5').contains('[OK]')
      cy.get('h6').contains('[OK]')
    })
  })
})