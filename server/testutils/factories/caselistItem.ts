import { Factory } from 'fishery'
import Caselist from '../../models/caseList'

class CaselistItemFactory extends Factory<Caselist> {}
export default CaselistItemFactory.define(({ sequence }) => ({
  referrals: [{ id: sequence.toString(), personName: 'Tony Stark', personCrn: 'X12345', status: 'Referral submitted' }],
}))
