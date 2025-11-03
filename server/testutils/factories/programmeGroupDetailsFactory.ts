import { Factory } from 'fishery'
import { ProgrammeGroupDetails } from '@manage-and-deliver-api'

class ProgrammeGroupDetailsFactory extends Factory<ProgrammeGroupDetails> {}
export default ProgrammeGroupDetailsFactory.define(() => ({
  group: {
    code: 'BCCDD1',
    regionName: 'Region not found',
  },
  allocationAndWaitlistData: {
    counts: {
      waitlist: 2,
      allocated: 1,
    },
    pagination: {
      size: 10,
      page: 0,
    },
    filters: {
      sex: ['Male', 'Female'],
      cohort: ['General Offence', 'General Offence - LDC', 'Sexual Offence', 'Sexual Offence - LDC'],
      pduNames: ['Manchester', 'London', 'Liverpool'],
      reportingTeams: [
        'Manchester Office 1',
        'London Office 1',
        'London Office 2',
        'Manchester Office 2',
        'Liverpool Office 1',
      ],
    },
    paginatedAllocationData: [
      {
        crn: 'X718250',
        personName: 'Edgar Schiller',
        sentenceEndDate: '28 April 2027',
        status: 'Awaiting assessment',
      },
    ],
    paginatedWaitlistData: [
      {
        crn: 'D002399',
        personName: 'Karen Puckett',
        sentenceEndDate: '28 April 2027',
        cohort: 'GENERAL_OFFENCE',
        hasLdc: false,
        age: 36,
        sex: 'Female',
        pdu: 'London',
        reportingTeam: 'London Office 2',
        status: 'Awaiting allocation',
      },
      {
        crn: 'D007523',
        personName: 'Mr Joye Hatto',
        sentenceEndDate: '28 April 2027',
        cohort: 'SEXUAL_OFFENCE',
        hasLdc: true,
        age: 36,
        sex: 'Male',
        pdu: 'Liverpool',
        reportingTeam: 'Liverpool Office 1',
        status: 'Awaiting allocation',
      },
    ],
  },
}))
