"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path = __importStar(require("path"));
// Check if it has datetime argument
// import * as moment from moment;
const dateValidations_1 = __importDefault(require("./classes/dateValidations"));
const read_csv_1 = require("./functions/read_csv");
// const script_dir: string = path.dirname(__filename)
const target_path = '/workspaces/typescript-backend-sample/files'; // Dir where is commissioning_report.csv files
const date_validation = new dateValidations_1.default('2022-06-07', '2022-06-08');
const start_date = date_validation.get_start_date();
const end_date = date_validation.get_end_date();
if (!date_validation.check_date_format(start_date) ||
    !date_validation.check_date_format(end_date)) {
    console.log('Error: Incorrect date format. It should be YYYY-MM-DD');
    process.exit(1);
}
if (date_validation.check_if_date_is_greater_than(start_date, end_date)) {
    console.log('Error: Incorrect date. Start date cannot be greater than end date');
    process.exit(1);
}
/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_period = date_validation.getRange(start_date, end_date);
(async () => {
    // const relays_name = await mysql.get_glpi_data()
    // console.log(relays_name)
    const relays = {};
    for (const _date of date_period) {
        const csv_file_path = path.join(target_path, `${_date}_commissioning_report.csv`);
        const csv_content = await (0, read_csv_1.read_csv)(csv_file_path);
        for (const row of csv_content) {
            const device_type = row['Device Type'];
            const relay_orca_serial = row['Device ID'];
            const last_communication_time = row['Last Commmunication Time'];
            console.log(device_type, typeof row);
            if (device_type != 'RELAY')
                continue;
            const lct = date_validation.change_date_format(last_communication_time);
            const v = lct == _date ? 1 : 0;
            if (relays.hasOwnProperty(relay_orca_serial))
                relays[relay_orca_serial][_date] = v;
            else
                relays[relay_orca_serial] = { [_date]: v };
        }
    }
    //   const csv_content = await csvtojson().fromFile(csv_file_path)
    console.log(relays.length);
    const output = { ...relays };
    const calculation = {};
    for (const [key, value] of Object.entries(relays)) {
        console.log(key, value, 'x');
        const relay_orca_serial = key;
        for (const _date of date_period) {
            if (_date in value) {
                const v = calculation.hasOwnProperty(relay_orca_serial)
                    ? calculation[relay_orca_serial] + value[_date]
                    : value[_date];
                calculation[relay_orca_serial] = v;
            }
            else {
                const v = calculation.hasOwnProperty(relay_orca_serial)
                    ? calculation[relay_orca_serial] + 1
                    : 1;
                calculation[relay_orca_serial] = v;
                if (output.hasOwnProperty(relay_orca_serial))
                    output[relay_orca_serial][_date] = 1;
                else
                    output[relay_orca_serial] = { [_date]: 1 };
            }
        }
    }
    for (const [key, value] of Object.entries(calculation)) {
        const relay_orca_serial = key;
        output[relay_orca_serial]['avg'] = ((value / date_period.length) * 100).toFixed(2);
    }
    for (const [key, value] of Object.entries(output)) {
        console.log(key, value.avg);
    }
    const header = [...date_period];
    header.unshift('device_id', 'name', 'id_relay', 'avg');
})();
//# sourceMappingURL=index.js.map