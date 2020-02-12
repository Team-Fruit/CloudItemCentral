import mlog from "./logger/logger"

const crypto = require("crypto")
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./server.config', 'utf8'))

