import { CohortEnum, ProgrammeGroupOverview } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { randomUUID } from 'crypto'

class ProgrammeGroupOverviewFactory extends Factory<ProgrammeGroupOverview> {
  allocatedList() {
    return this.params({
      pagedGroupData: {
        content: [
          {
            referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
            sourcedFrom: 'Licence end date',
            crn: 'X718250',
            personName: 'Edgar Schiller',
            sentenceEndDate: '28 April 2027',
            cohort: 'SEXUAL_OFFENCE' as CohortEnum,
            hasLdc: false,
            age: 36,
            sex: 'Male',
            pdu: 'London',
            reportingTeam: 'London Office 1',
            status: 'Scheduled',
            statusColour: 'purple',
            activeProgrammeGroupId: null,
          },
          {
            referralId: 'ae43bc75-b96e-496b-b9da-20ea327d7909',
            sourcedFrom: 'Order end date',
            crn: 'X718255',
            personName: 'Roy Kloss',
            sentenceEndDate: '14 April 2028',
            cohort: 'GENERAL_OFFENCE' as CohortEnum,
            hasLdc: true,
            age: 29,
            sex: 'Male',
            pdu: 'London',
            reportingTeam: 'London Office 2',
            status: 'Scheduled',
            statusColour: 'purple',
            activeProgrammeGroupId: null,
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalPages: 1,
        totalElements: 2,
        first: true,
        size: 10,
        number: 0,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        numberOfElements: 2,
        empty: false,
      },
    })
  }

  waitlist() {
    return this.params({
      pagedGroupData: {
        content: [
          {
            referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
            sourcedFrom: 'Licence end date',
            crn: 'X718250',
            personName: 'Edgar Schiller',
            sentenceEndDate: '28 April 2027',
            cohort: 'SEXUAL_OFFENCE' as CohortEnum,
            hasLdc: false,
            age: 36,
            sex: 'Male',
            pdu: 'London',
            reportingTeam: 'London Office 1',
            status: 'Scheduled',
            statusColour: 'purple',
            activeProgrammeGroupId: '897bee70-d0a5-48ac-b8b8-e4ab5ea7ad1d',
          },
          {
            referralId: 'ae43bc75-b96e-496b-b9da-20ea327d7909',
            sourcedFrom: 'Order end date',
            crn: 'X718255',
            personName: 'Roy Kloss',
            sentenceEndDate: '14 April 2028',
            cohort: 'GENERAL_OFFENCE' as CohortEnum,
            hasLdc: true,
            age: 29,
            sex: 'Male',
            pdu: 'London',
            reportingTeam: 'London Office 2',
            status: 'Scheduled',
            statusColour: 'purple',
            activeProgrammeGroupId: '897bee70-d0a5-48ac-b8b8-e4ab5ea7ad1d',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalPages: 1,
        totalElements: 2,
        first: true,
        size: 10,
        number: 0,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        numberOfElements: 2,
        empty: false,
      },
    })
  }
}

export default ProgrammeGroupOverviewFactory.define(() => ({
  group: {
    id: randomUUID(),
    code: 'BCCDD1',
    regionName: 'North East',
  },
  filters: {
    sex: ['Male', 'Female'],
    cohort: ['General Offence', 'General Offence - LDC', 'Sexual Offence', 'Sexual Offence - LDC'],
    locationFilters: [
      {
        pduName: 'Manchester',
        reportingTeams: ['Manchester Office 1', 'Manchester Office 2'],
      },
      {
        pduName: 'London',
        reportingTeams: ['London Office 1', 'London Office 2'],
      },
      {
        pduName: 'Liverpool',
        reportingTeams: ['Liverpool Office 1'],
      },
    ],
  },
  pagedGroupData: {
    content: [
      {
        referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
        sourcedFrom: 'Licence end date',
        crn: 'X718250',
        personName: 'Edgar Schiller',
        sentenceEndDate: '28 April 2027',
        cohort: 'SEXUAL_OFFENCE' as CohortEnum,
        hasLdc: false,
        age: 36,
        sex: 'Male',
        pdu: 'London',
        reportingTeam: 'London Office 1',
        status: 'Scheduled',
        statusColour: 'purple',
        activeProgrammeGroupId: '897bee70-d0a5-48ac-b8b8-e4ab5ea7ad1d',
      },
      {
        referralId: 'ae43bc75-b96e-496b-b9da-20ea327d7909',
        sourcedFrom: 'Order end date',
        crn: 'X718255',
        personName: 'Roy Kloss',
        sentenceEndDate: '14 April 2028',
        cohort: 'GENERAL_OFFENCE' as CohortEnum,
        hasLdc: true,
        age: 29,
        sex: 'Male',
        pdu: 'London',
        reportingTeam: 'London Office 2',
        status: 'Scheduled',
        statusColour: 'purple',
        activeProgrammeGroupId: '897bee70-d0a5-48ac-b8b8-e4ab5ea7ad1d',
      },
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalPages: 1,
    totalElements: 2,
    first: true,
    size: 10,
    number: 0,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false,
    },
    numberOfElements: 2,
    empty: false,
  },
  otherTabTotal: 2,
}))
