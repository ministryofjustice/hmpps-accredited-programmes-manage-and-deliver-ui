export type MojTimelineItem = HtmlOrText & {
  byline: {
    text: string
  }
  datetime: {
    timestamp: string
    type?: 'date' | 'datetime' | 'shortdate' | 'shortdatetime' | 'time'
  }
  label: HtmlOrText
}