describe('Globalization Testing - Button', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/button.html?locale=en')
  })

  it('Checking for English translation in button value', () => {
    cy.get('main button').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/button.html?locale=sv')
  })

  it('Checking for Swedish translation in button value', () => {
    cy.get('main button').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/button.html?locale=arc')
  })

  it('Checking for Aramaic translation in button value', () => {
    cy.get('main button').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
