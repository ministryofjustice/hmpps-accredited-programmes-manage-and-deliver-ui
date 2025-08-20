import type { Organisation, Person, RiskLevel } from '@accredited-programmes/models'
import type {
  Organisation as AcpOrganisation,
  Course,
  CourseOffering,
  CourseParticipation,
  PeopleSearchResponse,
  PniScore,
  Referral,
  ReferralStatusHistory,
  SexualOffenceDetails,
} from '@accredited-programmes-api'
import type {
  GovukFrontendButton,
  GovukFrontendPagination,
  GovukFrontendPaginationItem,
  GovukFrontendSummaryList,
  GovukFrontendSummaryListCardActions,
  GovukFrontendSummaryListCardActionsItem,
  GovukFrontendSummaryListRow,
  GovukFrontendSummaryListRowKey,
  GovukFrontendSummaryListRowValue,
  GovukFrontendTag,
} from '@govuk-frontend'
import type { OffenceDto, OffenceHistoryDetail } from '@prison-api'



type GovukFrontendSummaryListRowWithKeyAndValue = GovukFrontendSummaryListRow & {
  key: GovukFrontendSummaryListRowKey
  value: GovukFrontendSummaryListRowValue
}
