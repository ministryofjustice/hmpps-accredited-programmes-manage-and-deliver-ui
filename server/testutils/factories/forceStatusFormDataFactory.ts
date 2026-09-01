import { ForceStatusFormData } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Factory } from 'fishery'

class ForceStatusFormDataFactory extends Factory<ForceStatusFormData> {}

export default ForceStatusFormDataFactory.define(() => ({
  referralId: randomUUID(),
  crn: 'X933590',
  currentStatus: {
    id: '76b2f8d8-260c-4766-a716-de9325292609',
    status: 'Awaiting assessment',
    transitionDescription: null,
    isClosed: false,
    labelColour: 'purple',
  },
  availableStatuses: [
    {
      id: '76b2f8d8-260c-4766-a716-de9325292609',
      status: 'Awaiting assessment',
      transitionDescription: null,
      isClosed: false,
      labelColour: 'purple',
    },
    {
      id: 'bb1e8c72-cf52-4297-94a4-3745c2a25178',
      status: 'Awaiting allocation',
      transitionDescription: null,
      isClosed: false,
      labelColour: 'light-blue',
    },
    {
      id: '336b59cd-b467-4305-8547-6a645a8a3f91',
      status: 'Withdrawn',
      transitionDescription: null,
      isClosed: true,
      labelColour: 'red',
    },
  ],
}))
