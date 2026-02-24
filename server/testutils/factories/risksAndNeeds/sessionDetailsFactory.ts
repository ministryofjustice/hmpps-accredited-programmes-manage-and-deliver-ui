import { Factory } from 'fishery'
import { GroupSessionResponse } from '@manage-and-deliver-api'

class SessionDetailsFactory extends Factory<GroupSessionResponse> {}

export default SessionDetailsFactory.define(() => ({
  code: 'session-1',
  pageTitle: 'Test Session',
  sessionType: 'Group',
  date: '15 March 2025',
  time: '9:30am to midday',
  scheduledToAttend: ['Person 1', 'Person 2'],
  facilitators: ['Facilitator 1', 'Facilitator 2'],
  attendanceAndSessionNotes: [
    {
      name: 'Person 2',
      referralId: 'cb64c21b-cf10-4a6d-a118-f61d4f27f47b',
      crn: 'X12345',
      attendance: 'attended',
      sessionNotes: 'some notes',
    },
  ],
}))
