import { Factory } from 'fishery'
import { GroupSessionResponse } from '@manage-and-deliver-api'

class GroupSessionDetailsFactory extends Factory<GroupSessionResponse> {}

export default GroupSessionDetailsFactory.define(() => ({
  code: 'session-1',
  pageTitle: 'Test Session',
  sessionType: 'Group',
  date: '15 March 2025',
  time: '9:30am to midday',
  timeWithCapitalisedMidday: '9:30am to Midday',
  scheduledToAttend: [
    { forename: 'Person', surname: '1' },
    { forename: 'Person', surname: '2' },
  ],
  facilitators: [
    { forename: 'Facilitator', surname: '1' },
    { forename: 'Facilitator', surname: '2' },
  ],
  attendanceAndSessionNotes: [
    {
      name: { forename: 'Person', surname: '2' },
      referralId: 'cb64c21b-cf10-4a6d-a118-f61d4f27f47b',
      crn: 'X12345',
      lao: false,
      attendance: 'attended',
      sessionNotes: 'some notes',
      isExcluded: false,
    },
  ],
}))
