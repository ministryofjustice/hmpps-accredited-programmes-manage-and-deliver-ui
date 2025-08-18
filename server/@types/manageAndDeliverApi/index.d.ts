import type { components } from './imported'

type ReferralCaseListItem = components['schemas']['ReferralCaseListItem']
type Availability = components['schemas']['Availability']
type CreateAvailability = components['schemas']['CreateAvailability']
type UpdateAvailability = components['schemas']['UpdateAvailability']
type ReferralDetails = components['schemas']['ReferralDetails']
type PersonalDetails = components['schemas']['PersonalDetails']
type DailyAvailabilityModel = components['schemas']['DailyAvailabilityModel']
type SentenceInformation = components['schemas']['SentenceInformation']
type CohortEnum = components['schemas']['ReferralDetails']['cohort']
type OffenceHistory = components['schemas']['OffenceHistory']
type RoshAnalysis = components['schemas']['RoshAnalysis']

export type {
  Availability,
  CohortEnum,
  CreateAvailability,
  DailyAvailabilityModel,
  OffenceHistory,
  PersonalDetails,
  ReferralCaseListItem,
  ReferralDetails,
  RoshAnalysis,
  SentenceInformation,
  UpdateAvailability,
}
