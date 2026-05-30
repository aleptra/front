import { dom } from '../../fixtures/js/front';

describe('Unit Testing - Scroll functions', () => {

  context('Testing API functions', () => {
    const newDiv = document.createElement("div")
    it('Top', function () {
      expect(dom.scrollTo(newDiv, "top"))
    })
    it('Bottom', function () {
      expect(dom.scrollTo(newDiv, "bottom"))
    })
    it('Pixels', function () {
      expect(dom.scrollTo(newDiv, 33))
    })
  })
})