export enum ListStyle {
  noMarkers,
  bulleted,
}

export type SummaryListItemContent = string
export type SummaryListItemContentWithLdc = {
  item: string
  hasLdc: boolean
}

export interface SummaryListItem {
  key?: string
  lines?: SummaryListItemContent[] | SummaryListItemContentWithLdc[]
  html?: string
  listStyle?: ListStyle
  changeLink?: string
  deleteLink?: string
  valueLink?: string
  keyClass?: string
}
