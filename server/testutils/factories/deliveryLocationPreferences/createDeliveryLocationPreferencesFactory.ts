import { CreateDeliveryLocationPreferences } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

export class CreateDeliveryLocationPreferencesFactory extends Factory<CreateDeliveryLocationPreferences> {}

export default CreateDeliveryLocationPreferencesFactory.define(() => ({
  preferredDeliveryLocations: [
    {
      pduCode: 'LDN',
      pduDescription: 'London PDU',
      deliveryLocations: [
        { code: 'LDN1', description: 'London Office 1' },
        { code: 'LDN2', description: 'London Office 2' },
        { code: 'LDN3', description: 'London Office 3' },
      ],
    },
  ],
  cannotAttendText: '',
}))
