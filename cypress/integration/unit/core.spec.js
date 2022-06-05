import { core } from '../../fixtures/front';

describe('Unit Testing - Core', () => {

  it('Trim', function () {
    expect(core.trim('  trim  ')).to.eq('trim')
  })

  it('Uppercase', function () {
    expect(core.toUpper('uppercase')).to.eq('UPPERCASE')
  })

  it('Lowercase', function () {
    expect(core.toLower('LOWERCASE')).to.eq('lowercase')
  })
})