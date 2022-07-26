describe('Globalization Testing - Div', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/div.html?locale=en')
  })

  it('Checking for English translation in div value', () => {
    cy.get('main div').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/div.html?locale=sv')
  })

  it('Checking for Swedish translation in div value', () => {
    cy.get('main div').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/div.html?locale=arc')
  })

  it('Checking for Aramaic translation in div value', () => {
    cy.get('main div').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
