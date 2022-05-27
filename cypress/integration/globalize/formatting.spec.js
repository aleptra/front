describe('Globalization Testing - Formatting', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/formatting.html?locale=en')
  })

  it('Checking for English translation in formattings', () => {
    cy.get("main").within(() => {
      cy.get('b').contains('Hello world!')
      cy.get('strong').contains('Hello world!')
      cy.get('i').contains('Hello world!')
      cy.get('em').contains('Hello world!')
      cy.get('mark').contains('Hello world!')
      cy.get('small').contains('Hello world!')
      cy.get('del').contains('Hello world!')
      cy.get('ins').contains('Hello world!')
      cy.get('sub').contains('Hello world!')
      cy.get('sup').contains('Hello world!')
    })
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/formatting.html?locale=sv')
  })

  it('Checking for Swedish translation in formattings', () => {
    cy.get("main").within(() => {
      cy.get('b').contains('Hallå världen!')
      cy.get('strong').contains('Hallå världen!')
      cy.get('i').contains('Hallå världen!')
      cy.get('em').contains('Hallå världen!')
      cy.get('mark').contains('Hallå världen!')
      cy.get('small').contains('Hallå världen!')
      cy.get('del').contains('Hallå världen!')
      cy.get('ins').contains('Hallå världen!')
      cy.get('sub').contains('Hallå världen!')
      cy.get('sup').contains('Hallå världen!')
    })
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/formatting.html?locale=arc')
  })

  it('Checking for Aramaic translation in formattings', () => {
    cy.get("main").within(() => {
      cy.get('b').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('strong').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('i').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('em').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('mark').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('small').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('del').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('ins').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('sub').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('sup').contains('ܫܠܡܐ ܒܪܝܬܐ!')
    })
  })
})
