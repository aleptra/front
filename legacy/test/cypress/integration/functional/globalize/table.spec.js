describe('Globalization Testing - Table', () => {
  it('Opening GUI in English', () => {
    cy.visit('globalize/table.html?locale=en')
  })

  it('Checking for English translation in table', () => {
    cy.get("main").within(() => {
      cy.get('table caption').contains('Hello world!')
      cy.get('table thead th').contains('Hello world!')
      cy.get('table tbody tr td').contains('Hello world!')
      cy.get('table tfoot tr td').eq(0).contains('Hello world!')
      cy.get('table tfoot tr td').eq(1).contains('Hello world!')
    })
  })

  it('Opening GUI in Swedish', () => {
    cy.visit('globalize/table.html?locale=sv')
  })

  it('Checking for Swedish translation in table', () => {
    cy.get("main").within(() => {
      cy.get('table caption').contains('Hallå världen!')
      cy.get('table thead th').contains('Hallå världen!')
      cy.get('table tbody tr td').contains('Hallå världen!')
      cy.get('table tfoot tr td').eq(0).contains('Hallå världen!')
      cy.get('table tfoot tr td').eq(1).contains('Hallå världen!')
    })
  })

  it('Opening GUI in Aramaic', () => {
    cy.visit('globalize/table.html?locale=arc')
  })

  it('Checking for Aramaic translation in table', () => {
    cy.get("main").within(() => {
      cy.get('table caption').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('table thead th').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('table tbody tr td').contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('table tfoot tr td').eq(0).contains('ܫܠܡܐ ܒܪܝܬܐ!')
      cy.get('table tfoot tr td').eq(1).contains('ܫܠܡܐ ܒܪܝܬܐ!')
    })
  })
})