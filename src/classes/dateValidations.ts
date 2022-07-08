import moment, { Moment } from 'moment'

// type _Date = `${number}${number}${number}${number}-${number}${number}-${number}${number}`
import { IDate } from '../interfaces/IDate'

class DateValidation {
  start_date: IDate
  end_date: IDate

  constructor(start_date: IDate, end_date: IDate) {
    this.start_date = start_date
    this.end_date = end_date
  }

  check_date_format(d: IDate | string | Moment, date_format: string = 'YYYY-MM-DD'): boolean {
    if (moment(d, date_format, true).isValid()) return true
    else return false
  }

  check_if_date_is_greater_than(d1: string, d2: string): boolean {
    const _diff = moment(d1).diff(moment(d2), 'days')

    if (_diff >= 0) return true
    else return false
  }

  change_date_format(d: string, date_format: string = 'YYYY-MM-DD'): string {
    return moment(d).format(date_format)
  }

  /**
   * @param startDate The start date
   * @param endDate The end date
   */
  getRange(startDate: string, endDate: string, date_format = 'YYYY-MM-DD'): IDate[] {
    const fromDate = moment(startDate)
    const toDate = moment(endDate)
    const diff = toDate.diff(fromDate, 'days') + 1

    const range: Array<IDate> = []

    for (let i = 0; i < diff; i++) {
      const d = <IDate>moment(startDate).add(i, 'days').format(date_format)
      range.push(d)
    }

    return range
  }

  get_start_date() {
    return this.start_date
  }

  get_end_date() {
    return this.end_date
  }
}

export = DateValidation
