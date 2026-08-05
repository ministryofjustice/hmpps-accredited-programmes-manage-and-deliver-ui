export interface MojAlertComponentBase {
  variant: 'success' | 'warning' | 'error'
  title: string
  dismissible?: boolean
  showTitleAsHeading?: boolean
  role?: 'region' | 'status' | 'alert'
  attributes?: Record<string, string | number | boolean>
}
/**
 * An incomplete list of arguments for the
 * @see https://design-patterns.service.justice.gov.uk/components/alert/#how-to-use-tab
 */
export type MojAlertComponentArgs =
  (MojAlertComponentBase & { html: string }) | (MojAlertComponentBase & { text: string })
