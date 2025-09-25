declare module '@ministryofjustice/frontend/moj/filters/all.js' {
  interface Filters {
    mojDate(
      moment: Date | string, // actual implementation uses moment.MomentInput
      type?: 'date' | 'datetime' | 'shortdate' | 'shortdatetime' | 'time',
    ): string
  }

  export default () => Filters
}
