import superagent from 'superagent'
import logger from '../../logger'

interface BankHolidayEvent {
  title: string
  date: string
  notes: string
  bunting: boolean
}

interface BankHolidayDivision {
  division: string
  events: BankHolidayEvent[]
}

interface BankHolidaysResponse {
  'england-and-wales': BankHolidayDivision
}

export default class BankHolidaysService {
  private static cachedBankHolidays: string[] | null = null

  private static cacheTimestamp: number | null = null

  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000

  async getEnglandAndWalesBankHolidays(): Promise<string[]> {
    if (
      BankHolidaysService.cachedBankHolidays &&
      BankHolidaysService.cacheTimestamp &&
      Date.now() - BankHolidaysService.cacheTimestamp < BankHolidaysService.CACHE_DURATION
    ) {
      return BankHolidaysService.cachedBankHolidays
    }

    try {
      logger.info('Fetching bank holidays from gov.uk API')
      const response = await superagent
        .get('https://www.gov.uk/bank-holidays.json')
        .timeout({ response: 5000, deadline: 10000 })

      const data: BankHolidaysResponse = response.body
      const bankHolidayDates = data['england-and-wales'].events.map(event => event.date)

      BankHolidaysService.cachedBankHolidays = bankHolidayDates
      BankHolidaysService.cacheTimestamp = Date.now()

      logger.info(`Successfully fetched ${bankHolidayDates.length} bank holidays`)
      return bankHolidayDates
    } catch (error) {
      logger.error('Error fetching bank holidays from gov.uk API', error)
      return []
    }
  }

  isBankHoliday(dateString: string, bankHolidays: string[]): boolean {
    const [day, month, year] = dateString.split('/').map(Number)
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bankHolidays.includes(formattedDate)
  }
}
