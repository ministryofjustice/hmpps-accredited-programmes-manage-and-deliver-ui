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
  addPreferredLocations: {
    addAnotherPDU: 'Select whether you want to add locations in another PDU',
  },
  cannotAttendLocations: {
    cannotAttendLocationsRadios: {
      requiredRadioSelection: 'Select whether there are any locations the person cannot attend',
    },
    cannotAttendTextArea: {
      exceededCharacterLimit: 'Location details must be 2,000 characters or fewer',
      inputRequired: 'Give details of the locations the person cannot attend',
    },
  },
  updateStatus: {
    updatedStatusEmpty: `Select the referral status you want to move the person to.`,
    detailsTooLong: 'Details must be 500 characters or fewer.',
  },
  addToGroup: {
    selectAPerson: "Select the button next to a person's name to add them to the group",
    addToGroupEmpty: `Select whether you want to add the person to the group or not`,
    exceededCharacterLimit: 'Details must be 500 characters or fewer',
  },
  removeFromGroup: {
    selectAPerson: "Select the button next to a person's name to remove them from the group",
    removeFromGroupEmpty: `Select whether you want to remove the person from the group or not`,
    updatedStatusEmpty: `Select a new referral status`,
    detailsTooLong: 'Details must be 500 characters or fewer.',
  },
  createGroup: {
    createGroupCodeEmpty: 'Enter a code for your group',
    createGroupCodeExists: (code: string) =>
      `Group code ${code} already exists for a group in this region. Enter a different code.`,
    createGroupCohortSelect: 'Select a cohort',
    createGroupDateSelect: 'Enter or select a date',
    createGroupDateInvalid: 'Enter a date in the format 10/7/2025',
    createGroupDateInPast: 'Start date must be in the future',
    createGroupSexSelect: 'Select a sex',
    createGroupWhenSelect: 'Select at least one day',
    createGroupWhenHourRequired: 'Enter a complete start time',
    createGroupWhenHourInvalid: 'Enter an hour between 1 and 12',
    createGroupWhenAmOrPmRequired: 'Select whether the start time is am or pm',
    createGroupWhenMinutesInvalid: 'Enter a minute between 00 and 59',
    createGroupPduEmpty: 'Select a probation delivery unit. Start typing to search.',
    createGroupLocationEmpty: 'Select a delivery location.',
    createGroupTreatmentManagerEmpty: 'Select a Treatment Manager. Start typing to search.',
    createGroupFacilitatorEmpty: 'Select a Facilitator. Start typing to search.',
  },

  sessionSchedule: {
    sessionScheduleWhich: 'Select the session type',
  },

  motivationBackgroundAndNonAssociations: {
    addToGroupEmpty: `Select whether you want to add the person to the group or not`,
    exceededCharacterLimit: 'Details must be 2,000 characters or fewer',
  },
  returnedError,
  userHeaderTypes,
  errorHandlerAccessErrorMessages,
}
