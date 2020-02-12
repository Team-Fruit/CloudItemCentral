const fs = require('fs')
const config = JSON.parse(fs.readFileSync('../../server.config', 'utf8'))
const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    connectionLimit: 50
})
export class DBManager {
    async getServers() {
        let conn
        try {
            conn = await pool.getConnection()
            const res = conn.query("INSERT INTO servers value (?, ?)", ["test1", "test1pass"])
        } catch (err) {
            throw err
        }
        if (conn) conn.release()
    }
}
