// Explicit return types would make this file very messy and not much more
// informational — everything returned is a string, since they’re messages!

const errorHandlerAccessErrorMessages = {
  notSetUpCorrectly:
    'Your account is not set up correctly. Ask an admin user in your organisation to fix this in HMPPS Digital Services.',
  notSetUpCorrectlyCRS:
    'Your account is not set up correctly. Ask an admin user in your organisation to add the ‘CRS provider’ role in HMPPS Digital Services.',
  emailNotRecognised:
    'Your email address is not recognised. If it has changed recently, try signing out and signing in with the correct one. Ask an admin user in your organisation to check what the right email is in HMPPS Digital Services. If that does not work, <a target="_blank" href="/report-a-problem">report it as a problem.</a>',
  providerGroupNotRecognised:
    'Your provider group is not recognised. Ask an admin in your organisation to check it has been set up correctly in HMPPS Digital Services. They may need to <a target="_blank" href="/report-a-problem">report it as a problem.</a>',
  contractGroupNotRecognised:
    'Your contract group is not recognised. Ask an admin in your organisation to check it has been set up correctly in HMPPS Digital Services. They may need to <a target="_blank" href="/report-a-problem">report it as a problem.</a>',
  groupsDoNotMatch:
    'The contract and supplier groups on your account do not match. Ask an admin user in your organisation to fix this in HMPPS Digital Services.',
  noContactGroups:
    'You do not have any contract groups on your account. Ask an admin in your organisation to set this up in HMPPS Digital Services.',
  noServiceGroups:
    'You do not have any supplier groups on your account. Ask an admin in your organisation to set this up in HMPPS Digital Services.',
}

const userHeaderTypes = {
  userHeaderService: 'You do not have permission to view this service',
  userHeaderPage: 'You do not have permission to view this page',
  default: 'Sorry, you are not authorised to access this page',
}

const returnedError = {
  'cannot find user in hmpps auth': {
    mappedMessage: errorHandlerAccessErrorMessages.emailNotRecognised,
    userHeaderType: userHeaderTypes.userHeaderPage,
  },
}

export default {
  addAvailability: {
    availabilitiesEmpty: `Select times the person is available or select 'cancel'.`,
    otherAvailabilityDetailsEmpty: 'Availability details must be 2,000 characters or fewer.',
  },
  addAvailabilityDates: {
    requireEndDateEmpty: `Select whether the availability details will change on a specific date.`,
    endDateEmpty: `Enter a date in the format 17/5/2024 or select the calendar icon to pick a date.`,
    endDateInPast: 'Enter or select a date in the future',
  },
  returnedError,
  userHeaderTypes,
  errorHandlerAccessErrorMessages,
}
