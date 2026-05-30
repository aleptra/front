describe('Globalization Testing - Span', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/span.html?locale=en')
  })

  it('Checking for English translation in span value', () => {
    cy.get('main span').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/span.html?locale=sv')
  })

  it('Checking for Swedish translation in span value', () => {
    cy.get('main span').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/span.html?locale=arc')
  })

  it('Checking for Aramaic translation in span value', () => {
    cy.get('main span').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
