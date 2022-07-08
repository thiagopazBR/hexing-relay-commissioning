"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysql = void 0;
const assert_1 = require("assert");
const mysql2_1 = require("mysql2");
(0, assert_1.strict)(process.env.GLPI_DB_HOST, 'GLPI_DB_HOST is invalid or undefined');
(0, assert_1.strict)(process.env.GLPI_DB_NAME, 'GLPI_DB_NAME is invalid or undefined');
(0, assert_1.strict)(process.env.GLPI_DB_USER, 'GLPI_DB_USER is invalid or undefined');
(0, assert_1.strict)(process.env.GLPI_DB_PASS, 'GLPI_DB_PASS is invalid or undefined');
class Mysql {
    constructor() {
        this.connection = (0, mysql2_1.createConnection)({
            database: process.env.GLPI_DB_NAME,
            host: process.env.GLPI_DB_HOST,
            password: process.env.GLPI_DB_PASS,
            user: process.env.GLPI_DB_USER
        });
    }
    select(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, rows) => {
                if (err)
                    reject({ error: err });
                resolve({ data: rows });
            });
        });
    }
    async get_glpi_data() {
        const query = `
      SELECT
        p.serial,
        p.name as peripheral,
        pl.idrelayfield as idrelay
      FROM
        glpi_peripherals as p
      LEFT JOIN
        glpi_plugin_fields_peripheraldeviceconfigurations as pl ON pl.items_id = p.id
      WHERE
        p.is_deleted != 1
        AND p.peripheraltypes_id = '3';`;
        const result = await this.select(query);
        const output = {};
        for (const r of result.data)
            if (r.serial) {
                const relay_serial = r.serial;
                const relay_name = r.peripheral;
                const id_relay = r.idrelay ? r.idrelay : relay_serial;
                output[relay_serial] = { id_relay: id_relay, name: relay_name };
            }
        return Promise.resolve(output);
    }
}
exports.Mysql = Mysql;
// for qr in query_result:
//         if qr['serial'] != None:
//             relay_serial = qr['serial']
//             relay_name =  qr['peripheral']
//             id_relay = qr['idrelay'] if qr['idrelay'] else relay_serial
//             output[relay_serial] = {"name": relay_name, "id_relay": id_relay }
//# sourceMappingURL=Mysql.js.map