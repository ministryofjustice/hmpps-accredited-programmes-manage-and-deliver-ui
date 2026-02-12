import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Risks } from '@manage-and-deliver-api'
import FactoryHelpers from '../factoryHelpers'

const alert = (): string => faker.lorem.word()

const riskLevel = () => faker.helpers.arrayElement(['Low', 'Medium', 'High'])
const percentage = () => faker.number.int({ max: 100, min: 0 })

class RiskAndAlertsFactory extends Factory<Risks> {}

export default RiskAndAlertsFactory.define(
  (): Risks => ({
    alerts: Array(faker.helpers.rangeToNumber({ max: 10, min: 1 }))
      .fill(undefined)
      .map(_element => alert()),
    assessmentCompleted: '1 August 2024',
    offenderGroupReconviction: {
      oneYear: percentage(),
      twoYears: percentage(),
      scoreLevel: 'LOW',
    },
    offenderViolencePredictor: {
      oneYear: percentage(),
      twoYears: percentage(),
      scoreLevel: 'MEDIUM',
    },
    sara: {
      imminentRiskOfViolenceTowardsPartner: FactoryHelpers.optionalArrayElement(riskLevel()),
      imminentRiskOfViolenceTowardsOthers: FactoryHelpers.optionalArrayElement(riskLevel()),
    },
    riskOfSeriousRecidivism: {
      ospcScore: FactoryHelpers.optionalArrayElement(riskLevel()),
      ospiScore: FactoryHelpers.optionalArrayElement(riskLevel()),
      scoreLevel: FactoryHelpers.optionalArrayElement(
        faker.number.float({ max: 100, min: 0, multipleOf: 0.01 }).toString(),
      ),
      percentageScore: FactoryHelpers.optionalArrayElement(riskLevel()),
    },
    riskOfSeriousHarm: {
      overallRoshLevel: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskChildrenCommunity: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskChildrenCustody: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskKnownAdultCommunity: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskKnownAdultCustody: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskPrisonersCustody: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskPublicCommunity: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskPublicCustody: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskStaffCommunity: FactoryHelpers.optionalArrayElement(riskLevel()),
      riskStaffCustody: FactoryHelpers.optionalArrayElement(riskLevel()),
    },
    lastUpdated: '1 August 2024',
    dateRetrieved: '1 August 2024',
    isLegacy: true,
    ogrS4Risks: undefined,
    legacy: true,
  }),
)
