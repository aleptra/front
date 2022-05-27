describe('Globalization Testing - Formatting', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/formatting.html?locale=en')
  })

  it('Checking for English translation in formattings', () => {
    cy.get('main b').contains('Hello world!')
    cy.get('main strong').contains('Hello world!')
    cy.get('main i').contains('Hello world!')
    cy.get('main em').contains('Hello world!')
    cy.get('main mark').contains('Hello world!')
    cy.get('main small').contains('Hello world!')
    cy.get('main del').contains('Hello world!')
    cy.get('main ins').contains('Hello world!')
    cy.get('main sub').contains('Hello world!')
    cy.get('main sup').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/formatting.html?locale=sv')
  })

  it('Checking for Swedish translation in formattings', () => {
    cy.get('main b').contains('Hallå världen!')
    cy.get('main strong').contains('Hallå världen!')
    cy.get('main i').contains('Hallå världen!')
    cy.get('main em').contains('Hallå världen!')
    cy.get('main mark').contains('Hallå världen!')
    cy.get('main small').contains('Hallå världen!')
    cy.get('main del').contains('Hallå världen!')
    cy.get('main ins').contains('Hallå världen!')
    cy.get('main sub').contains('Hallå världen!')
    cy.get('main sup').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/formatting.html?locale=arc')
  })

  it('Checking for Aramaic translation in formattings', () => {
    cy.get('main b').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main strong').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main i').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main em').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main mark').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main small').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main del').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main ins').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main sub').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    cy.get('main sup').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
