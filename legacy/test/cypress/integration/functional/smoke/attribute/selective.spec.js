describe('Smoke Testing - selective', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/selective.html')
  })

  it('Checking for selective attributes in elements', () => {
    cy.get("main").within(() => {
      cy.get('div').should('have.attr', 'selective')
    })
  })

  it('Clicking on link 1', () => {
    cy.get('main #links div a').eq(0).click()
  })

  it('Checking if link 1 is active', () => {
    cy.get("main #links div").within(() => {
      cy.get('a').eq(0).should('have.class', 'sel')
      cy.get('a').eq(1).should('not.have.class', 'sel')
      cy.get('a').eq(2).should('not.have.class', 'sel')
    })
  })

  it('Clicking on link 2', () => {
    cy.get('main #links div a').eq(1).click()
  })

  it('Checking if link 2 is active', () => {
    cy.get("main #links div").within(() => {
      cy.get('a').eq(0).should('not.have.class', 'sel')
      cy.get('a').eq(1).should('have.class', 'sel')
      cy.get('a').eq(2).should('not.have.class', 'sel')
    })
  })

  it('Clicking on link 3', () => {
    cy.get('main #links div a').eq(2).click()
  })

  it('Checking if link 3 is active', () => {
    cy.get("main #links div").within(() => {
      cy.get('a').eq(0).should('not.have.class', 'sel')
      cy.get('a').eq(1).should('not.have.class', 'sel')
      cy.get('a').eq(2).should('have.class', 'sel')
    })
  })

  it('Clicking on button 1', () => {
    cy.get('main #buttons div button').eq(0).click()
  })

  it('Checking if button 1 is active', () => {
    cy.get("main #buttons div").within(() => {
      cy.get('button').eq(0).should('have.class', 'sel')
      cy.get('button').eq(1).should('not.have.class', 'sel')
      cy.get('button').eq(2).should('not.have.class', 'sel')
    })
  })

  it('Clicking on button 2', () => {
    cy.get('main #buttons div button').eq(1).click()
  })

  it('Checking if button 2 is active', () => {
    cy.get("main #buttons div").within(() => {
      cy.get('button').eq(0).should('not.have.class', 'sel')
      cy.get('button').eq(1).should('have.class', 'sel')
      cy.get('button').eq(2).should('not.have.class', 'sel')
    })
  })

  it('Clicking on button 3', () => {
    cy.get('main #buttons div button').eq(2).click()
  })

  it('Checking if button 3 is active', () => {
    cy.get("main #buttons div").within(() => {
      cy.get('button').eq(0).should('not.have.class', 'sel')
      cy.get('button').eq(1).should('not.have.class', 'sel')
      cy.get('button').eq(2).should('have.class', 'sel')
    })
  })
})