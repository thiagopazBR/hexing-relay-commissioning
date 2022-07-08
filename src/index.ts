import 'dotenv/config'

import * as path from 'path'

// Check if it has datetime argument
// import * as moment from moment;
import DateValidation from './classes/dateValidations'
import { read_csv } from './functions/read_csv'
import { ICalculation, IRelays } from './interfaces/IRelays'

// const script_dir: string = path.dirname(__filename)
const target_path: string = '/workspaces/typescript-backend-sample/files' // Dir where is commissioning_report.csv files
const date_validation = new DateValidation('2022-06-07', '2022-06-08')

const start_date = date_validation.get_start_date()
const end_date = date_validation.get_end_date()

if (
  !date_validation.check_date_format(start_date) ||
  !date_validation.check_date_format(end_date)
) {
  console.log('Error: Incorrect date format. It should be YYYY-MM-DD')
  process.exit(1)
}

if (date_validation.check_if_date_is_greater_than(start_date, end_date)) {
  console.log('Error: Incorrect date. Start date cannot be greater than end date')
  process.exit(1)
}

/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_period = date_validation.getRange(start_date, end_date)

// const mysql = new Mysql()

;(async () => {
  // const relays_name = await mysql.get_glpi_data()
  // console.log(relays_name)

  const relays: IRelays = {}

  for (const _date of date_period) {
    const csv_file_path = path.join(target_path, `${_date}_commissioning_report.csv`)
    const csv_content = await read_csv(csv_file_path)
    for (const row of csv_content) {
      const device_type: string = row['Device Type']
      const relay_orca_serial: string = row['Device ID']
      const last_communication_time: string = row['Last Commmunication Time']

      console.log(device_type, typeof row)
      if (device_type != 'RELAY') continue

      const lct = date_validation.change_date_format(last_communication_time)

      const v: number = lct == _date ? 1 : 0

      if (relays.hasOwnProperty(relay_orca_serial)) relays[relay_orca_serial][_date] = v
      else relays[relay_orca_serial] = { [_date]: v }
    }
  }
  //   const csv_content = await csvtojson().fromFile(csv_file_path)

  console.log(relays.length)
  const output: IRelays = { ...relays }
  const calculation: ICalculation = {}

  for (const [key, value] of Object.entries(relays)) {
    console.log(key, value, 'x')
    const relay_orca_serial = key

    for (const _date of date_period) {
      if (_date in value) {
        const v: number = calculation.hasOwnProperty(relay_orca_serial)
          ? calculation[relay_orca_serial] + value[_date]
          : value[_date]

        calculation[relay_orca_serial] = v
      } else {
        const v: number = calculation.hasOwnProperty(relay_orca_serial)
          ? calculation[relay_orca_serial] + 1
          : 1

        calculation[relay_orca_serial] = v

        if (output.hasOwnProperty(relay_orca_serial)) output[relay_orca_serial][_date] = 1
        else output[relay_orca_serial] = { [_date]: 1 }
      }
    }
  }

  for (const [key, value] of Object.entries(calculation)) {
    const relay_orca_serial: string = key
    output[relay_orca_serial]['avg'] = ((value / date_period.length) * 100).toFixed(2)
  }

  for (const [key, value] of Object.entries(output)) {
    console.log(key, value.avg)
  }

  const header: string[] = [...date_period]
  header.unshift('device_id', 'name', 'id_relay', 'avg')
})()
