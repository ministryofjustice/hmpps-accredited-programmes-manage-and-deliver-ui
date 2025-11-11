import ProgrammeGroupDetailsFactory from '../testutils/factories/programmeGroupDetailsFactory'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupListFilter from './groupListFilter'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('groupDetailsPresenter.', () => {
  describe('generateTableHeadings', () => {
    it('should return the correct table headings for allocated list', () => {
      const filterObject = { status: undefined, cohort: undefined, nameOrCRN: undefined } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Allocated, groupDetails, '1234', filterObject)
      expect(presenter.generateTableHeadings()).toEqual([
        { text: '' },
        { text: 'Name and CRN', attributes: { 'aria-sort': 'ascending' } },
        { text: 'Sentence end date', attributes: { 'aria-sort': 'none' } },
        { text: 'Referral status', attributes: { 'aria-sort': 'none' } },
      ])
    })
    it('should return the correct table headings for waitlist', () => {
      const filterObject = { status: undefined, cohort: undefined, nameOrCRN: undefined } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', filterObject)
      expect(presenter.generateTableHeadings()).toEqual([
        { text: '' },
        { text: 'Name and CRN', attributes: { 'aria-sort': 'ascending' } },
        { text: 'Sentence end date', attributes: { 'aria-sort': 'none' } },
        { text: 'Cohort', attributes: { 'aria-sort': 'none' } },
        { text: 'Age', attributes: { 'aria-sort': 'none' } },
        { text: 'Sex', attributes: { 'aria-sort': 'none' } },
        { text: 'PDU', attributes: { 'aria-sort': 'none' } },
        { text: 'Reporting team', attributes: { 'aria-sort': 'none' } },
      ])
    })
  })
  describe('generateWaitlistTableArgs', () => {
    it('should return the correct table args for waitlist', () => {
      const filterObject = { status: undefined, cohort: undefined, nameOrCRN: undefined } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.waitlist().build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', filterObject)
      expect(presenter.generateWaitlistTableArgs()).toEqual([
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='39fde7e8-d2e3-472b-8364-5848bf673aa6' value='Edgar Schiller*39fde7e8-d2e3-472b-8364-5848bf673aa6' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="39fde7e8-d2e3-472b-8364-5848bf673aa6">
                      <span class="govuk-!-display-none">Add Edgar Schiller to the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          {
            html: `<a href="/referral-details/39fde7e8-d2e3-472b-8364-5848bf673aa6/personal-details">Edgar Schiller</a><p class="govuk-!-margin-bottom-0"> X718250</p>`,
          },

          { html: '28 April 2027<br> Licence end date' },

          {
            html: `Sexual Offence`,
          },
          { text: '36' },
          { text: 'Male' },
          { text: 'London' },
          { text: 'London Office 1' },
        ],
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='ae43bc75-b96e-496b-b9da-20ea327d7909' value='Roy Kloss*ae43bc75-b96e-496b-b9da-20ea327d7909' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="ae43bc75-b96e-496b-b9da-20ea327d7909">
                      <span class="govuk-!-display-none">Add Roy Kloss to the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          {
            html: `<a href="/referral-details/ae43bc75-b96e-496b-b9da-20ea327d7909/personal-details">Roy Kloss</a><p class="govuk-!-margin-bottom-0"> X718255</p>`,
          },

          { html: '14 April 2028<br> Order end date' },

          {
            html: 'General Offence</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
          },
          { text: '29' },
          { text: 'Male' },
          { text: 'London' },
          { text: 'London Office 2' },
        ],
      ])
    })
  })
  describe('generateAllocateTableArgs', () => {
    it('should return the correct table args for allocted list', () => {
      const filterObject = { status: undefined, cohort: undefined, nameOrCRN: undefined } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.allocatedList().build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', filterObject)

      expect(presenter.generateAllocatedTableArgs()).toEqual([
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='X718250' value='X718250' type="radio" name="removeFromGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="X718250">
                      <span class="govuk-!-display-none">Remove Edgar Schiller from the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          {
            html: `<a href="/referral-details/39fde7e8-d2e3-472b-8364-5848bf673aa6/personal-details">Edgar Schiller</a><p class="govuk-!-margin-bottom-0">X718250</p>`,
          },

          { html: '28 April 2027<br> Licence end date' },

          { html: `<strong class="govuk-tag govuk-tag--purple">Scheduled</strong>` },
        ],
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='X718255' value='X718255' type="radio" name="removeFromGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="X718255">
                      <span class="govuk-!-display-none">Remove Roy Kloss from the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          {
            html: `<a href="/referral-details/ae43bc75-b96e-496b-b9da-20ea327d7909/personal-details">Roy Kloss</a><p class="govuk-!-margin-bottom-0">X718255</p>`,
          },

          { html: '14 April 2028<br> Order end date' },

          { html: '<strong class="govuk-tag govuk-tag--purple">Scheduled</strong>' },
        ],
      ])
    })
  })

  describe('generatePduSelectArgs', () => {
    it('should return the correct select args for PDU', () => {
      const filterObject = { pdu: 'Liverpool' } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', filterObject)
      expect(presenter.generatePduSelectArgs()).toEqual([
        {
          text: 'Select PDU',
          value: '',
        },
        {
          selected: true,
          text: 'Liverpool',
          value: 'Liverpool',
        },
        {
          selected: false,
          text: 'London',
          value: 'London',
        },
        {
          selected: false,
          text: 'Manchester',
          value: 'Manchester',
        },
      ])
    })
  })

  describe('generateReportingTeamCheckboxArgs', () => {
    it('should return the correct checkbox args for reporting Team', () => {
      const filterObject = {
        pdu: 'London',
        reportingTeam: ['London Office 1', 'Manchester Office 2'],
      } as GroupListFilter
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', filterObject)
      expect(presenter.generateReportingTeamCheckboxArgs()).toEqual([
        {
          text: 'Liverpool Office 1',
          value: 'Liverpool Office 1',
          checked: false,
        },
        {
          text: 'London Office 1',
          value: 'London Office 1',
          checked: true,
        },
        {
          text: 'London Office 2',
          value: 'London Office 2',
          checked: false,
        },
        {
          text: 'Manchester Office 1',
          value: 'Manchester Office 1',
          checked: false,
        },
        {
          text: 'Manchester Office 2',
          value: 'Manchester Office 2',
          checked: true,
        },
      ])
    })
  })
})
