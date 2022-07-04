import moment, { Moment } from 'moment'

type _Date = `${number}${number}${number}${number}-${number}${number}-${number}${number}`

class DateValidation {
  start_date: _Date
  end_date: _Date

  constructor(start_date: _Date, end_date: _Date) {
    this.start_date = start_date
    this.end_date = end_date
  }

  check_date_format(d: _Date | string | Moment, date_format = 'YYYY-MM-DD'): boolean {
    if (moment(d, date_format, true).isValid()) return true
    else return false
  }

  check_if_date_is_greater_than(d1: string, d2: string): boolean {
    const _diff = moment(d1).diff(moment(d2), 'days')

    if (_diff >= 0) return true
    else false
  }

  /**
   * @param startDate The start date
   * @param endDate The end date
   */
  getRange(startDate: string, endDate: string, date_format = 'YYYY-MM-DD'): string[] {
    const fromDate = moment(startDate)
    const toDate = moment(endDate)
    const diff = toDate.diff(fromDate, 'days') + 1

    const range = []

    for (let i = 0; i < diff; i++) range.push(moment(startDate).add(i, 'days').format(date_format))

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
