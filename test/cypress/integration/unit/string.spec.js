import { core } from '../../fixtures/js/front';

describe('Unit Testing - String functions', () => {

  context('Trim', () => {
    it('Removing whitespace from both sides of string', function () {
      expect(core.trim('   trim   ')).to.eq('trim')
      expect(core.trim('  trim  ')).to.eq('trim')
      expect(core.trim(' trim ')).to.eq('trim')
      expect(core.trim('trim ')).to.eq('trim')
      expect(core.trim(' trim')).to.eq('trim')
      expect(core.trim('  trim  ')).to.eq('trim')
      expect(core.trim('   trim   ')).to.eq('trim')
      expect(core.trim('    trim    ')).to.eq('trim')
    })
  })

  context('Uppercase', () => {
    it('Converting string to uppercase letters', function () {
      expect(core.toUpper(' uppercase ')).to.eq(' UPPERCASE ')
      expect(core.toUpper('  uppercase  ')).to.eq('  UPPERCASE  ')
      expect(core.toUpper('uppercase')).to.eq('UPPERCASE')
    })
  })

  context('Lowercase', () => {
    it('Converting string to lowercase letters', function () {
      expect(core.toLower(' LOWERCASE ')).to.eq(' lowercase ')
      expect(core.toLower('  LOWERCASE  ')).to.eq('  lowercase  ')
      expect(core.toLower('LOWERCASE')).to.eq('lowercase')
    })
  })
})