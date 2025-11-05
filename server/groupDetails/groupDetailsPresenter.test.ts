import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import ProgrammeGroupDetailsFactory from '../testutils/factories/programmeGroupDetailsFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('groupDetailsPresenter.', () => {
  describe('generateTableHeadings', () => {
    it('should return the correct table headings for allocated list', () => {
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      // const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Allocated, groupDetails, '1234')

      const presenter = new GroupDetailsPresenter(
        GroupDetailsPageSection.Allocated,
        { content: [], totalElements: 0, totalPages: 0, numberOfElements: 0, number: 0, size: 10 },
        groupDetails,
        undefined,
        '1234',
        '',
        null,
        null,
      )

      expect(presenter.generateTableHeadings()).toEqual([
        { text: '' },
        { text: 'Name and CRN', attributes: { 'aria-sort': 'ascending' } },
        { text: 'Sentence end date', attributes: { 'aria-sort': 'none' } },
        { text: 'Referral status', attributes: { 'aria-sort': 'none' } },
      ])
    })
    it('should return the correct table headings for waitlist', () => {
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      // const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234')

      const presenter = new GroupDetailsPresenter(
        GroupDetailsPageSection.Waitlist,
        { content: [], totalElements: 0, totalPages: 0, numberOfElements: 0, number: 0, size: 10 },
        groupDetails,
        undefined,
        '1234',
        '',
        null,
        null,
      )

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
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      // const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234', '')

      const presenter = new GroupDetailsPresenter(
        GroupDetailsPageSection.Waitlist,
        { content: [], totalElements: 0, totalPages: 0, numberOfElements: 0, number: 0, size: 10 },
        groupDetails,
        undefined,
        '1234',
        '',
        null,
        null,
      )

      expect(presenter.generateWaitlistTableArgs()).toEqual([
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='123456' value='Karen Puckett*123456' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="123456">
                      <span class="govuk-!-display-none">Add Karen Puckett to the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          { html: `<a href="">Karen Puckett</a><p class="govuk-!-margin-bottom-0"> D002399</p>` },
          { text: '28 April 2027' },
          {
            html: `General Offence`,
          },
          { text: '36' },
          { text: 'Female' },
          { text: 'London' },
          { text: 'London Office 2' },
        ],
        [
          {
            html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='987654' value='Mr Joye Hatto*987654' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="987654">
                      <span class="govuk-!-display-none">Add Mr Joye Hatto to the group</span>
                    </label>
                  </div>
                 </div>`,
          },
          { html: `<a href="">Mr Joye Hatto</a><p class="govuk-!-margin-bottom-0"> D007523</p>` },
          { text: '28 April 2027' },
          {
            html: 'Sexual Offence</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
          },
          { text: '36' },
          { text: 'Male' },
          { text: 'Liverpool' },
          { text: 'Liverpool Office 1' },
        ],
      ])
    })
  })
  describe('generateAllocateTableArgs', () => {
    it('should return the correct table args for allocted list', () => {
      const groupDetails = ProgrammeGroupDetailsFactory.build()
      // const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, '1234')

      const presenter = new GroupDetailsPresenter(
        GroupDetailsPageSection.Waitlist,
        { content: [], totalElements: 0, totalPages: 0, numberOfElements: 0, number: 0, size: 10 },
        groupDetails,
        undefined,
        '1234',
        '',
        null,
        null,
      )
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
          { html: `<a href="">Edgar Schiller</a><p class="govuk-!-margin-bottom-0">X718250</p>` },
          { text: '28 April 2027' },
          { html: `<strong class="govuk-tag govuk-tag--blue">Awaiting assessment</strong>` },
        ],
      ])
    })
  })
})
