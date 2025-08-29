import { Relationships } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class RelationshipsFactory extends Factory<Relationships> {}

export default RelationshipsFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  dvEvidence: true,
  victimFormerPartner: true,
  victimFamilyMember: false,
  victimOfPartnerFamily: false,
  perpOfPartnerOrFamily: true,
  relIssuesDetails:
    'The person has a history of domestic violence and controlling behavior in relationships. They have difficulty maintaining healthy relationships and often resort to aggressive tactics when conflicts arise.',
}))
