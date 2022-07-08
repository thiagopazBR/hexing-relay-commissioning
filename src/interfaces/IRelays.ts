import { IDate } from './IDate'

type _Date = {
  [key: IDate]: number
  avg?: string
}

interface IRelays {
  [relay_orca_serial: string]: _Date
}

interface ICalculation {
  [relay_orca_serial: string]: number
}

export { IRelays, ICalculation }
