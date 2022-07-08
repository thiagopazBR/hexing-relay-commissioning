"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const moment_1 = __importDefault(require("moment"));
class DateValidation {
    constructor(start_date, end_date) {
        this.start_date = start_date;
        this.end_date = end_date;
    }
    check_date_format(d, date_format = 'YYYY-MM-DD') {
        if ((0, moment_1.default)(d, date_format, true).isValid())
            return true;
        else
            return false;
    }
    check_if_date_is_greater_than(d1, d2) {
        const _diff = (0, moment_1.default)(d1).diff((0, moment_1.default)(d2), 'days');
        if (_diff >= 0)
            return true;
        else
            return false;
    }
    change_date_format(d, date_format = 'YYYY-MM-DD') {
        return (0, moment_1.default)(d).format(date_format);
    }
    /**
     * @param startDate The start date
     * @param endDate The end date
     */
    getRange(startDate, endDate, date_format = 'YYYY-MM-DD') {
        const fromDate = (0, moment_1.default)(startDate);
        const toDate = (0, moment_1.default)(endDate);
        const diff = toDate.diff(fromDate, 'days') + 1;
        const range = [];
        for (let i = 0; i < diff; i++) {
            const d = (0, moment_1.default)(startDate).add(i, 'days').format(date_format);
            range.push(d);
        }
        return range;
    }
    get_start_date() {
        return this.start_date;
    }
    get_end_date() {
        return this.end_date;
    }
}
module.exports = DateValidation;
//# sourceMappingURL=dateValidations.js.map