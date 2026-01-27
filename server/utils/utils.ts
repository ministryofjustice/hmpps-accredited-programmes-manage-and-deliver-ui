const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

export const firstToLowerCase = (word: string): string =>
  word.length >= 1 ? word[0].toLowerCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const formatCohort = (cohort?: string): string | null => {
  const formatted = cohort
    .toLowerCase() // convert to lowercase
    .replace('_', ' ') // replace underscore with space

  // Capitalize first letter only
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export const convertToUrlFriendlyKebabCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.trim().toLowerCase().replace(/[():]/g, '').replace(/\s+/g, '-')
