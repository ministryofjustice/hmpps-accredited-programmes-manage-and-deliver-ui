import { ReferralStatusTransitions } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class ReferralStatusTransitionsFactory extends Factory<ReferralStatusTransitions> {}

export default ReferralStatusTransitionsFactory.define(() => ({
  currentStatus: {
    statusDescriptionId: '76b2f8d8-260c-4766-a716-de9325292609',
    title: 'Awaiting assessment',
    tagColour: 'purple',
    updatedByName: 'USER_ID_12345',
    createdAt: '18 November 2025',
  },
  availableStatuses: [
    {
      id: 'bb1e8c72-cf52-4297-94a4-3745c2a25178',
      status: 'Awaiting allocation',
      transitionDescription: 'The person has been assessed as suitable and can be allocated to a group.',
      isClosed: false,
      labelColour: 'light-blue',
    },
    {
      id: '336b59cd-b467-4305-8547-6a645a8a3f91',
      status: 'Suitable but not ready',
      transitionDescription:
        'The person meets the suitability criteria but is not ready to start the programme. The referral will be paused until they are ready.',
      isClosed: false,
      labelColour: 'yellow',
    },
    {
      id: 'bc8c7024-045b-4a82-bb97-e6b8c0f198cb',
      status: 'Deprioritised',
      transitionDescription:
        'The person is suitable but does not meet the prioritisation criteria. The referral will be paused in case they are re-prioritised.',
      isClosed: false,
      labelColour: 'yellow',
    },
    {
      id: 'aec91cd3-fba0-40a4-a5c6-7578b596af75',
      status: 'Recall',
      transitionDescription:
        'The person has been recalled. Depending on the recall type, the referral may be withdrawn or returned to awaiting assessment.',
      isClosed: false,
      labelColour: 'orange',
    },
    {
      id: 'e9fb9e3a-147b-4f26-aa0c-d852db4b7fef',
      status: 'Return to court',
      transitionDescription:
        'The person is not suitable for the programme or cannot continue with it. The referral will be returned to court.',
      isClosed: false,
      labelColour: 'orange',
    },
  ],
}))
