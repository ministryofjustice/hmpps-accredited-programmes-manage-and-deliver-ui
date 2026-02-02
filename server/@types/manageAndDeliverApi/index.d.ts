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
type RemoveFromGroupRequest = components['schemas']['RemoveFromGroupRequest']
type RemoveFromGroupResponse = components['schemas']['RemoveFromGroupResponse']
type GroupItem = components['schemas']['PageGroupItem']
type Relationships = components['schemas']['Relationships']
type Risks = components['schemas']['Risks']
type RoshAnalysis = components['schemas']['RoshAnalysis']
type ReferralMotivationBackgroundAndNonAssociations =
  components['schemas']['ReferralMotivationBackgroundAndNonAssociations']
type CreateOrUpdateReferralMotivationBackgroundAndNonAssociations =
  components['schemas']['CreateOrUpdateReferralMotivationBackgroundAndNonAssociations']
type SentenceInformation = components['schemas']['SentenceInformation']
type ThinkingAndBehaviour = components['schemas']['ThinkingAndBehaviour']
type UpdateAvailability = components['schemas']['UpdateAvailability']
type CreateDeliveryLocationPreferences = components['schemas']['CreateDeliveryLocationPreferences']
type DeliveryLocationPreferences = components['schemas']['DeliveryLocationPreferences']
type PreferredDeliveryLocation = components['schemas']['PreferredDeliveryLocation']
type ExistingDeliveryLocationPreferences = components['schemas']['ExistingDeliveryLocationPreferences']
type UpdateCohort = components['schemas']['UpdateCohort']
type UpdateLdc = components['schemas']['UpdateLdc']
type ReferralStatusTransitions = components['schemas']['ReferralStatusTransitions']
type CreateReferralStatusHistory = components['schemas']['CreateReferralStatusHistory']
type ReferralStatus = components['schemas']['ReferralStatus']
type CaseListFilterValues = components['schemas']['CaseListFilterValues']
type ReferralStatusHistory = components['schemas']['ReferralStatusHistory']
type LocationFilterValues = components['schemas']['LocationFilterValues']
type CaseListReferrals = components['schemas']['CaseListReferrals']
type CreateGroupRequest = components['schemas']['CreateGroupRequest']
type CreateGroupSessionSlot = components['schemas']['CreateGroupSessionSlot']
type Group = components['schemas']['Group']
type ProgrammeGroupCohortEnum = components['schemas']['CreateGroup']['ProgrammeGroupCohort']
type ProgrammeGroupDate = components['schemas']['CreateGroup']['startedAtDate']
type ProgrammeGroupSexEnum = components['schemas']['CreateGroup']['sex']
type ProgrammeGroupWhen = components['schemas']['CreateGroup']['createGroupSessionSlot']
type ProgrammeGroupEntity = components['schemas']['ProgrammeGroupEntity']
type AllocateToGroupRequest = components['schemas']['AllocateToGroupRequest']
type AllocateToGroupResponse = components['schemas']['AllocateToGroupResponse']
type GroupsByRegion = components['schemas']['GroupsByRegion']
type PageGroup = components['schemas']['PageGroup']
type CodeDescription = components['schemas']['CodeDescription']
type UserTeamMember = components['schemas']['UserTeamMember']
type CreateGroupTeamMember = components['schemas']['CreateGroupTeamMember']
type SessionScheduleRequest = components['schemas']['ScheduleSessionRequest']
type SessionScheduleResponse = components['schemas']['ScheduleSessionTypeResponse']
type SessionScheduleGroupResponse = components['schemas']['SessionScheduleGroupResponse']
type ModuleSessionTemplate = components['schemas']['ModuleSessionTemplate']
type ScheduleSessionTypeResponse = components['schemas']['ScheduleSessionTypeResponse']
type ScheduleIndividualSessionDetailsResponse = components['schemas']['ScheduleIndividualSessionDetailsResponse']
type ScheduleSessionRequest = components['schemas']['ScheduleSessionRequest']
type GroupSessionResponse = components['schemas']['GroupSessionResponse']
type GroupSchedule = components['schemas']['GroupSchedule']
type GroupScheduleSession = components['schemas']['GroupScheduleSession']
type Session = components['schemas']['Session']

export type {
  AlcoholMisuseDetails,
  AllocateToGroupRequest,
  AllocateToGroupResponse,
  Attitude,
  Availability,
  CaseListFilterValues,
  CaseListReferrals,
  CreateGroupTeamMember,
  CodeDescription,
  CohortEnum,
  CreateAvailability,
  CreateDeliveryLocationPreferences,
  CreateGroupRequest,
  CreateGroupSessionSlot,
  CreateOrUpdateReferralMotivationBackgroundAndNonAssociations,
  CreateReferralStatusHistory,
  DailyAvailabilityModel,
  DeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  DrugDetails,
  EmotionalWellbeing,
  ExistingDeliveryLocationPreferences,
  Group,
  GroupsByRegion,
  GroupItem,
  GroupSchedule,
  GroupScheduleSession,
  GroupSessionResponse,
  Health,
  LearningNeeds,
  LifestyleAndAssociates,
  LocationFilterValues,
  ModuleSessionTemplate,
  OffenceAnalysis,
  OffenceHistory,
  PageGroup,
  PersonalDetails,
  PniScore,
  PreferredDeliveryLocation,
  ProgrammeGroupCohortEnum,
  ProgrammeGroupDate,
  ProgrammeGroupDetails,
  ProgrammeGroupEntity,
  ProgrammeGroupSexEnum,
  ProgrammeGroupWhen,
  ReferralCaseListItem,
  ReferralDetails,
  ReferralMotivationBackgroundAndNonAssociations,
  ReferralStatus,
  ReferralStatusFormData,
  ReferralStatusHistory,
  ReferralStatusTransitions,
  Relationships,
  RemoveFromGroupRequest,
  RemoveFromGroupResponse,
  Risks,
  RoshAnalysis,
  ScheduleIndividualSessionDetailsResponse,
  ScheduleSessionRequest,
  ScheduleSessionTypeResponse,
  Session,
  SessionScheduleGroupResponse,
  SessionScheduleRequest,
  SessionScheduleResponse,
  SentenceInformation,
  ThinkingAndBehaviour,
  UpdateAvailability,
  UpdateCohort,
  UpdateLdc,
  UserTeamMember,
}
