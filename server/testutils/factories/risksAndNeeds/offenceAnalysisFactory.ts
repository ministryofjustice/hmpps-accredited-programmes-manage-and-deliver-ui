import { OffenceAnalysis } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class OffenceAnalysisFactory extends Factory<OffenceAnalysis> {}

export default OffenceAnalysisFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  briefOffenceDetails: 'Ms Puckett admits he went to Mr Smith address on 23rd march 2010.',
  victimsAndPartners: {
    contactTargeting: 'Yes',
    raciallyMotivated: 'No',
    revenge: 'No',
    physicalViolenceTowardsPartner: 'No',
    repeatVictimisation: 'Yes',
    victimWasStranger: 'No',
    stalking: 'No',
  },
  recognisesImpact: 'Yes',
  otherOffendersAndInfluences: {
    wereOtherOffendersInvolved: 'Yes',
    numberOfOthersInvolved: '2',
    wasTheOffenderLeader: 'No',
    peerGroupInfluences: 'No',
  },
  motivationAndTriggers: 'Ms Puckett stated that as she had been attempting to address her long standing addiction',
  responsibility: {
    acceptsResponsibility: 'Yes',
    acceptsResponsibilityDetail:
      'Ms Puckett acknowledged that his response to this particular situation had been disproportionately violent and dangerous.',
  },
  patternOfOffending: 'Mr Smith has an unenviable record of 25 previous convictions recorded to his detriment',
}))
