describe('GUI Testing - Select', () => {
  it('Opening GUI', () => {
    cy.visit('gui/select.html')
  })

  
  context('Select - Normal', () => {
    it('Choosing options in select', () => {
      cy.get("main").within(() => {
        cy.get('select').eq(0).select('Option 1').should('have.value', 'Option 1')
        cy.get('select option:selected').eq(0).should('have.text', 'Option 1')
        cy.get('select').eq(0).select('Option 2').should('have.value', 'Option 2')
        cy.get('select option:selected').eq(0).should('have.text', 'Option 2')
      })
    })
  })

  context('Select - Outlined', () => {
    it('Choosing options in select', () => {
      cy.get("main").within(() => {
        cy.get('select').eq(1).select('Option 1').should('have.value', 'Option 1')
        cy.get('select option:selected').eq(1).should('have.text', 'Option 1')
        cy.get('select').eq(1).select('Option 2').should('have.value', 'Option 2')
        cy.get('select option:selected').eq(1).should('have.text', 'Option 2')
      })
    })
    it.skip('Checking placeholder', () => {
      cy.get("main").within(() => {
        cy.get('select').eq(1).select('All').invoke('val').should('be.disabled')
      })
    })
  })

})
