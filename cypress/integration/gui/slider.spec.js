
describe('GUI Testing - Slider', () => {
  it('Opening GUI', () => {
    cy.visit('gui/slider.html')
  })

  it('Clicking on slide button 1', () => {
    cy.get('main label').eq(0).click()
  })

  it('Clicking on slide button 2', () => {
    cy.get('main label').eq(1).click()
  })

  it('Clicking on slide button 3', () => {
    cy.get('main label').eq(2).click()
  })

})
