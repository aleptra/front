
describe('Globalization Testing - P', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/p.html?locale=en')
  })

  it('Checking for English translation in p value', () => {
    cy.get('main p').contains('Hello world!')
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/p.html?locale=sv')
  })

  it('Checking for Swedish translation in p value', () => {
    cy.get('main p').contains('Hallå världen!')
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/p.html?locale=arc')
  })

  it('Checking for Aramaic translation in p value', () => {
    cy.get('main p').contains('ܫܠܡܐ ܒܪܝܬܐ!')
  })
})
