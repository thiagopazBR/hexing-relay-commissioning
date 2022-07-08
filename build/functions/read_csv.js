"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read_csv = void 0;
const fs_1 = require("fs");
async function read_csv(csv_file_path) {
    const data = [];
    return new Promise((resolve, reject) => {
        (0, fs_1.createReadStream)(csv_file_path)
            .pipe(csvtojson())
            .on('data', function (d) {
            const jsonStr = d.toString('utf8');
            data.push(jsonStr);
        })
            .on('end', function () {
            resolve(data);
        });
        // .on('error', function (err) {
        //   reject(err)
        // })
    });
}
exports.read_csv = read_csv;
//# sourceMappingURL=read_csv.js.map