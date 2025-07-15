export enum ListStyle {
  noMarkers,
  bulleted,
}

export type SummaryListItemContent = string

export interface SummaryListItem {
  key: string
  lines: SummaryListItemContent[]
  listStyle?: ListStyle
  changeLink?: string
  deleteLink?: string
  valueLink?: string
}
