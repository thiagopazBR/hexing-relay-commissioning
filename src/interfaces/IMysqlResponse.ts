import { QueryError, RowDataPacket } from 'mysql2'

export interface IMysqlResponse {
  data?: RowDataPacket[]
  error?: QueryError
}
