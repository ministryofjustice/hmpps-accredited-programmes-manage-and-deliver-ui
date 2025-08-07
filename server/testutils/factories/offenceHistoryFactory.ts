import { OffenceHistory } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class OffenceHistoryFactory extends Factory<OffenceHistory> {}

export default OffenceHistoryFactory.define(() => ({
  mainOffence: {
    offence: 'Kidnapping',
    offenceCode: '036',
    category: 'Hijacking',
    offenceDate: '2000-01-01',
    categoryCode: '02',
  },
  additionalOffences: [
    {
      offence: 'Absconding from lawful custody',
      offenceCode: '08000',
      category: 'Absconding from lawful custody',
      offenceDate: '2013-01-13',
      categoryCode: '02',
    },
  ],
}))
