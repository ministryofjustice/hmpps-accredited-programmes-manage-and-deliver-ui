import { ReferralStatusFormData } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class ReferralStatusFormDataFactory extends Factory<ReferralStatusFormData> {}

export default ReferralStatusFormDataFactory.define(() => ({
  currentStatus: {
    statusDescriptionId: '76b2f8d8-260c-4766-a716-de9325292609',
    title: 'Awaiting assessment',
    tagColour: 'purple',
    updatedByName: 'USER_ID_12345',
    createdAt: '25 September 2025',
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
  ],
}))
