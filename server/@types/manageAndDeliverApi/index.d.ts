import type { components } from './imported'

type AlcoholMisuseDetails = components['schemas']['AlcoholMisuseDetails']
type Attitude = components['schemas']['Attitude']
type Availability = components['schemas']['Availability']
type CohortEnum = components['schemas']['ReferralDetails']['cohort']
type CreateAvailability = components['schemas']['CreateAvailability']
type DailyAvailabilityModel = components['schemas']['DailyAvailabilityModel']
type DeliveryLocationPreferencesFormData = components['schemas']['DeliveryLocationPreferencesFormData']
type DrugDetails = components['schemas']['DrugDetails']
type EmotionalWellbeing = components['schemas']['EmotionalWellbeing']
type Health = components['schemas']['Health']
type LearningNeeds = components['schemas']['LearningNeeds']
type LifestyleAndAssociates = components['schemas']['LifestyleAndAssociates']
type OffenceAnalysis = components['schemas']['OffenceAnalysis']
type OffenceHistory = components['schemas']['OffenceHistory']
type PersonalDetails = components['schemas']['PersonalDetails']
type PniScore = components['schemas']['PniScore']
type ProgrammeGroupDetails = components['schemas']['ProgrammeGroupDetails']
type ReferralCaseListItem = components['schemas']['ReferralCaseListItem']
type ReferralDetails = components['schemas']['ReferralDetails']
type ReferralStatusTransitions = components['schemas']['ReferralStatusTransitions']
type Relationships = components['schemas']['Relationships']
type Risks = components['schemas']['Risks']
type RoshAnalysis = components['schemas']['RoshAnalysis']
type SentenceInformation = components['schemas']['SentenceInformation']
type ThinkingAndBehaviour = components['schemas']['ThinkingAndBehaviour']
type UpdateAvailability = components['schemas']['UpdateAvailability']
type CreateDeliveryLocationPreferences = components['schemas']['CreateDeliveryLocationPreferences']
type DeliveryLocationPreferences = components['schemas']['DeliveryLocationPreferences']
type PreferredDeliveryLocation = components['schemas']['PreferredDeliveryLocation']
type ExistingDeliveryLocationPreferences = components['schemas']['ExistingDeliveryLocationPreferences']
type UpdateCohort = components['schemas']['UpdateCohort']
type UpdateLdc = components['schemas']['UpdateLdc']
type ReferralStatusFormData = components['schemas']['ReferralStatusFormData']
type CreateReferralStatusHistory = components['schemas']['CreateReferralStatusHistory']
type ReferralStatus = components['schemas']['ReferralStatus']
type CaseListFilterValues = components['schemas']['CaseListFilterValues']
type ReferralStatusHistory = components['schemas']['ReferralStatusHistory']
type LocationFilterValues = components['schemas']['LocationFilterValues']
type CaseListReferrals = components['schemas']['CaseListReferrals']
type CreateGroupRequest = components['schemas']['CreateGroupRequest']
type ProgrammeGroupCohortEnum = components['schemas']['CreateGroup']['cohort']
type ProgrammeGroupSexEnum = components['schemas']['CreateGroup']['sex']
type ProgrammeGroupEntity = components['schemas']['ProgrammeGroupEntity']

export type {
  AlcoholMisuseDetails,
  Attitude,
  Availability,
  CaseListFilterValues,
  CaseListReferrals,
  CohortEnum,
  CreateAvailability,
  CreateDeliveryLocationPreferences,
  CreateGroupRequest,
  CreateReferralStatusHistory,
  DailyAvailabilityModel,
  DeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  DrugDetails,
  EmotionalWellbeing,
  ExistingDeliveryLocationPreferences,
  Health,
  LearningNeeds,
  LifestyleAndAssociates,
  LocationFilterValues,
  OffenceAnalysis,
  OffenceHistory,
  PersonalDetails,
  PniScore,
  PreferredDeliveryLocation,
  ProgrammeGroupCohortEnum,
  ProgrammeGroupDetails,
  ProgrammeGroupEntity,
  ProgrammeGroupSexEnum,
  ReferralCaseListItem,
  ReferralDetails,
  ReferralStatus,
  ReferralStatusFormData,
  ReferralStatusHistory,
  ReferralStatusTransitions,
  Relationships,
  Risks,
  RoshAnalysis,
  SentenceInformation,
  ThinkingAndBehaviour,
  UpdateAvailability,
  UpdateCohort,
  UpdateLdc,
}
