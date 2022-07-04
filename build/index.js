"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// import * as path from 'path'
// const script_dir: string = path.dirname(__filename)
// const target_path: string = '/usr/share/zabbix/modules/files/content/' // Dir where is commissioning_report.csv files
// Check if it has datetime argument
// import * as moment from moment;
const dateValidations_1 = __importDefault(require("./classes/dateValidations"));
const Mysql_1 = require("./classes/Mysql");
const date_validation = new dateValidations_1.default('2022-08-01', '2022-08-03');
const start_date = date_validation.get_start_date();
const end_date = date_validation.get_end_date();
if (!date_validation.check_date_format(start_date) ||
    !date_validation.check_date_format(end_date)) {
    console.log('Error: Incorrect date format, should be YYYY-MM-DD');
    process.exit(1);
}
if (date_validation.check_if_date_is_greater_than(start_date, end_date)) {
    console.log('Error: Incorrect date. Start date cannot be greater than end date');
    process.exit(1);
}
const date_period = date_validation.getRange(start_date, end_date);
for (const dp of date_period)
    console.log(dp);
const mysql = new Mysql_1.Mysql();
(async () => {
    const relays_name = await mysql.get_glpi_data();
    console.log(relays_name);
})();
//# sourceMappingURL=index.js.map