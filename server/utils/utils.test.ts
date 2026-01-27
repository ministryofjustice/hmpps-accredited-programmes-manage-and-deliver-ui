import { convertToUrlFriendlyKebabCase, convertToTitleCase, initialiseName } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('convert first letter to lower case', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'Yes', 'yes'],
    ['Two words', 'Robert James', 'robert James'],
    ['Three words', 'Does not need', 'does not need'],
  ])
})

describe('convert to kebab case', () => {
  it.each([
    [null, null, ''],
    ['Empty string', '', ''],
    ['Single word', 'Hello', 'hello'],
    ['Two words', 'Hello world', 'hello-world'],
    ['Leading spaces', '  Hello world ', 'hello-world'],
    ['Multiple spaces', 'Hello  how   are', 'hello-how-are'],
    ['Mixed case', 'HeLLo HoW ArE YoU', 'hello-how-are-you'],
    ['Already kebab', 'hello-world', 'hello-world'],
    ['With colon', 'Hello: world', 'hello-world'],
    ['With parentheses', 'Hello (world)', 'hello-world'],
    ['Colon and parentheses', 'Session: Group (Active)', 'session-group-active'],
    ['Multiple colons', 'Time: 9:30am', 'time-930am'],
  ])('%s convertToKebabCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToUrlFriendlyKebabCase(a)).toEqual(expected)
  })
})
