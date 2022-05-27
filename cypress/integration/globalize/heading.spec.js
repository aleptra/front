describe('Globalization Testing - Heading 1-6', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/heading.html?locale=en')
  })

  it('Checking for English translation in heading values', () => {
    cy.get("main").within(() => {
      cy.get('h1').contains('This is heading 1')
      cy.get('h2').contains('This is heading 2')
      cy.get('h3').contains('This is heading 3')
      cy.get('h4').contains('This is heading 4')
      cy.get('h5').contains('This is heading 5')
      cy.get('h6').contains('This is heading 6')
    })
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/heading.html?locale=sv')
  })

  it('Checking for Swedish translation in heading values', () => {
    cy.get("main").within(() => {
      cy.get('h1').contains('Det här är rubrik 1')
      cy.get('h2').contains('Det här är rubrik 2')
      cy.get('h3').contains('Det här är rubrik 3')
      cy.get('h4').contains('Det här är rubrik 4')
      cy.get('h5').contains('Det här är rubrik 5')
      cy.get('h6').contains('Det här är rubrik 6')
    })
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/heading.html?locale=arc')
  })

  it('Checking for Aramaic translation in heading values', () => {
    cy.get("main").within(() => {
      cy.get('h1').contains('ܐܝܬ ܗܟܢ 1')
      cy.get('h2').contains('ܐܝܬ ܗܟܢ 2')
      cy.get('h3').contains('ܐܝܬ ܗܟܢ 3')
      cy.get('h4').contains('ܐܝܬ ܗܟܢ 4')
      cy.get('h5').contains('ܐܝܬ ܗܟܢ 5')
      cy.get('h6').contains('ܐܝܬ ܗܟܢ 6')
    })
  })
})
