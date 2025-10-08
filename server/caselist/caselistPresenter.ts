import { CaseListFilterValues, CohortEnum, ReferralCaseListItem } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import { CheckboxesArgs, CheckboxesArgsItem, SelectArgsItem, TableArgs } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import CaselistFilter from './caselistFilter'
import CaselistUtils from './caseListUtils'

export enum CaselistPageSection {
  Open = 1,
  Closed = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual Offence',
  GENERAL_OFFENCE: 'General Offence',
}

export default class CaselistPresenter {
  public readonly pagination: Pagination

  public readonly openOrClosedUrl: string

  constructor(
    readonly section: CaselistPageSection,
    readonly referralCaseListItems: Page<ReferralCaseListItem>,
    readonly filter: CaselistFilter,
    readonly params: string,
    readonly isOpenReferrals: boolean,
    readonly caseListFilters: CaseListFilterValues,
  ) {
    this.pagination = new Pagination(referralCaseListItems, params)
    this.referralCaseListItems = referralCaseListItems
    this.openOrClosedUrl = isOpenReferrals ? 'open-referrals' : 'closed-referrals'
  }

  readonly text = {
    pageHeading: `Building Choices: moderate intensity`,
  }

  get showReportingLocations(): boolean {
    return this.filter.pdu !== undefined && this.filter.pdu !== ''
  }

  getCaseloadTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Name and CRN',
          attributes: {
            'aria-sort': 'ascending',
          },
        },
        {
          text: 'PDU',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Reporting team',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Cohort',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Referral status',
          attributes: {
            'aria-sort': 'none',
          },
        },
      ],
      rows: this.generateTableRows(),
    }
  }

  generateTableRows() {
    const referralData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.referralCaseListItems.content.forEach(referral => {
      referralData.push([
        {
          html: `<a href='/referral-details/${referral.referralId}/personal-details'>${referral.personName}</a><br><span>${referral.crn}</span>`,
        },
        { text: referral.pdu },
        { text: referral.reportingTeam },
        {
          html: `${cohortConfigMap[referral.cohort]}${CaselistUtils.hasLdcTagHtml(referral)}`,
        },
        { text: referral.referralStatus },
      ])
    })
    return referralData
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Open referrals (${this.section === CaselistPageSection.Open ? this.referralCaseListItems.totalElements : this.caseListFilters.otherReferralsCount})`,
          href: `/pdu/open-referrals`,
          active: this.section === CaselistPageSection.Open,
        },
        {
          text: `Closed referrals (${this.section === CaselistPageSection.Closed ? this.referralCaseListItems.totalElements : this.caseListFilters.otherReferralsCount})`,
          href: `/pdu/closed-referrals`,
          active: this.section === CaselistPageSection.Closed,
        },
      ],
    }
  }

  generateSelectValues(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select',
        value: '',
      },
    ]
    options.map(option =>
      selectOptions.push({
        value: option.value,
        text: option.text,
        selected: caseListFilter?.includes(`${option.value}`) ?? false,
      }),
    )
    return selectOptions
  }

  generatePduSelectArgs(): SelectArgsItem[] {
    const checkboxArgs = [
      {
        text: 'Select PDU',
        value: '',
      },
    ]
    const pduCheckboxArgs = this.caseListFilters.locationFilters
      .map(pdu => ({
        text: pdu.pduName,
        value: pdu.pduName,
        selected: this.filter.pdu === pdu.pduName,
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
    return checkboxArgs.concat(pduCheckboxArgs)
  }

  generateReportingTeamCheckboxArgs(): CheckboxesArgsItem[] {
    let checkboxItems: CheckboxesArgsItem[] = []
    if (this.showReportingLocations) {
      const pduLocationData = this.caseListFilters.locationFilters.find(
        location => location.pduName === this.filter.pdu,
      )
      checkboxItems = pduLocationData.reportingTeams
        .map(location => ({
          text: location,
          value: location,
          checked: this.filter.reportingTeam?.includes(location),
        }))
        .sort((a, b) => a.text.localeCompare(b.text))
    }
    return checkboxItems
  }

  generateNoResultsString(): string {
    if (this.section === CaselistPageSection.Open) {
      return this.caseListFilters.otherReferralsCount === 0
        ? 'No results found. Check your search details or try other filters.'
        : `No results in open referrals. ${this.caseListFilters.otherReferralsCount} result in closed referrals.`
    }
    return this.caseListFilters.otherReferralsCount === 0
      ? 'No results found. Check your search details or try other filters.'
      : `No results in closed referrals. ${this.caseListFilters.otherReferralsCount} result in open referrals.`
  }
}
