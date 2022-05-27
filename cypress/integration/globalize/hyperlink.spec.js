describe('Globalization Testing - Hyperlink', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/hyperlink.html?locale=en')
  })

  it('Checking for English translation in hyperlink name', () => {
    cy.get('main a').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/hyperlink.html?locale=sv')
  })

  it('Checking for Swedish translation in hyperlink name', () => {
    cy.get('main a').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/hyperlink.html?locale=arc')
  })

  it('Checking for Aramaic translation in hyperlink name', () => {
    cy.get('main a').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
