describe('Globalization Testing - Paragraph', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/paragraph.html?locale=en')
  })

  it('Checking for English translation in paragraphs', () => {
    cy.get("main").within(() => {
      cy.get('p').contains('Hello world!')
      cy.get('pre').contains('Hello world!')
    })
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/paragraph.html?locale=sv')
  })

  it('Checking for Swedish translation in paragraphs', () => {
    cy.get("main").within(() => {
      cy.get('p').contains('Hallå världen!')
      cy.get('pre').contains('Hallå världen!')
    })
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/paragraph.html?locale=arc')
  })

  it('Checking for Aramaic translation in paragraphs', () => {
    cy.get("main").within(() => {
      cy.get('p').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('pre').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    })
  })
})
