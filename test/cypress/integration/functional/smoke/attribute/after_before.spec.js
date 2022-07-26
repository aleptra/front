describe('Smoke Testing - after & before (Attribute)', () => {
  it('Opening GUI', () => {
    cy.visit('smoke/attribute/after_before.html')
  })

  context('Afterbegin', () => {
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

  context('Afterend', () => {
    it('Checking for afterend attribute in elements', () => {
      cy.get("main #afterend").within(() => {
        cy.get("button").should('have.attr', 'afterend')
        cy.get('div').should('have.attr', 'afterend')
        cy.get('span').should('have.attr', 'afterend')
        cy.get('p').should('have.attr', 'afterend')
        cy.get('h1').should('have.attr', 'afterend')
        cy.get('h2').should('have.attr', 'afterend')
        //cy.get('h3').should('have.attr', 'afterend') // Cypress bugg
        cy.get('h4').should('have.attr', 'afterend')
        cy.get('h5').should('have.attr', 'afterend')
        cy.get('h6').should('have.attr', 'afterend')
      })
    })

    it('Checking if afterend attribute is executed in elements', () => {
      cy.get("main #afterend").within(() => {
        cy.contains('[OK]').find('button')
        cy.contains('[OK]').find('div')
        cy.contains('[OK]').find('span')
        cy.contains('[OK]').find('p')
        cy.contains('[OK]').find('h1')
        cy.contains('[OK]').find('h2')
        cy.contains('[OK]').find('h3')
        cy.contains('[OK]').find('h4')
        cy.contains('[OK]').find('h5')
        cy.contains('[OK]').find('h6')
      })
    })
  })

  context('Beforebegin', () => {
    it('Checking for beforebegin attribute in elements', () => {
      cy.get("main #beforebegin").within(() => {
        cy.get("button").should('have.attr', 'beforebegin')
        cy.get('div').should('have.attr', 'beforebegin')
        cy.get('span').should('have.attr', 'beforebegin')
        cy.get('p').should('have.attr', 'beforebegin')
        cy.get('h1').should('have.attr', 'beforebegin')
        cy.get('h2').should('have.attr', 'beforebegin')
        //cy.get('h3').should('have.attr', 'beforebegin') // Cypress bugg
        cy.get('h4').should('have.attr', 'beforebegin')
        cy.get('h5').should('have.attr', 'beforebegin')
        cy.get('h6').should('have.attr', 'beforebegin')
      })
    })

    it('Checking if beforebegin attribute is executed in elements', () => {
      cy.get("main #beforebegin").within(() => {
        cy.contains('[OK]').find('button')
        cy.contains('[OK]').find('div')
        cy.contains('[OK]').find('span')
        cy.contains('[OK]').find('p')
        cy.contains('[OK]').find('h1')
        cy.contains('[OK]').find('h2')
        cy.contains('[OK]').find('h3')
        cy.contains('[OK]').find('h4')
        cy.contains('[OK]').find('h5')
        cy.contains('[OK]').find('h6')
      })
    })
  })

  context('Beforeend', () => {
    it('Checking for beforeend attribute in elements', () => {
      cy.get("main #beforeend").within(() => {
        cy.get("button").should('have.attr', 'beforeend')
        cy.get('div').should('have.attr', 'beforeend')
        cy.get('span').should('have.attr', 'beforeend')
        cy.get('p').should('have.attr', 'beforeend')
        cy.get('h1').should('have.attr', 'beforeend')
        cy.get('h2').should('have.attr', 'beforeend')
        //cy.get('h3').should('have.attr', 'beforeend') // Cypress bugg
        cy.get('h4').should('have.attr', 'beforeend')
        cy.get('h5').should('have.attr', 'beforeend')
        cy.get('h6').should('have.attr', 'beforeend')
      })
    })

    it('Checking if beforerend attribute is executed in elements', () => {
      cy.get("main #beforeend").within(() => {
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
})