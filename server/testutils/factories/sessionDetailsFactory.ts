import { Factory } from 'fishery'
import { Session, CohortEnum } from '@manage-and-deliver-api'

class SessionDetailsFactory extends Factory<Session> {}

export default SessionDetailsFactory.define(() => ({
  id: 'session-1',
  type: 'Group',
  name: 'Test Session',
  number: 1,
  referrals: [
    {
      id: 'cb64c21b-cf10-4a6d-a118-f61d4f27f47b',
      personName: 'Person 1',
      crn: 'X12345',
      createdAt: '2025-01-01T00:00:00.000Z',
      status: 'ACTIVE',
      cohort: 'GENERAL_OFFENCE' as CohortEnum,
    },
  ],
  isCatchup: false,
  pageTitle: 'Test Session',
  code: 'session-1',
  sessionType: 'Group',
  date: '15 March 2025',
  time: '9:30am to midday',
  scheduledToAttend: [ 'Person 1'],
  facilitators: ['Facilitator 1', 'Facilitator 2'],
  attendanceAndSessionNotes: [
    {
      name: 'Person 1',
      referralId: 'cb64c21b-cf10-4a6d-a118-f61d4f27f47b',
      crn: 'X12345',
      attendance: 'attended',
      sessionNotes: 'some notes',
    },
  ],
}))
