import mlog from "./logger/logger"
// import DBManager from "./database/db"
const express = require('express')
const basicAuth = require('express-basic-auth')
const multer = require('multer')
const crypto = require("crypto")
const fs = require('fs')
const app = express()
// コンフィグを読み込み
const config = JSON.parse(fs.readFileSync('./server.config', 'utf8'))

app.use(basicAuth({
  users: { 'id': 'pass' }
}))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // パスを指定
    cb(null, config.server.dataPath)
  },
  filename: function (req, file, cb) {
    // {{uuid}}.datで保存
    cb(null, req.params.uuid + ".dat")
  }
})

const upload = multer({ storage: storage })

app.head("/api/v1/players/:uuid",  async (req, res, next) => {
  try {
    const file = fs.readFileSync(config.server.dataPath + '/' + req.params.uuid + ".dat", 'binary')
    mlog.info("head > " + req.params.uuid)
    res.status(204).send("exists")
  } catch(err) {
    res.status(404).send("not found")
  }
})

// 更新
app.put("/api/v1/players/:uuid", upload.single("nbt"), async (req, res, next) => {
  const {file} = req
  if (!file) {
    mlog.info("put data (failed)> " + req.params.uuid)
    res.status(404).send("FAILED!")
  } else {
    mlog.info("put data (success)> " + req.params.uuid)
    res.status(200).send("SUCCESS!")
  }
})

// GET TIME
app.get("/api/v1/players/:uuid/date",  async (req, res, next) => {
  try {
    mlog.info("check data (success)> " + req.params.uuid)
    const file = fs.statSync(config.server.dataPath + '/' + req.params.uuid + ".dat")
    res.status(200).send(file.mtime.getTime().toString())
  } catch(err) {
    mlog.info("check data (failed)> " + req.params.uuid)
    res.status(404).send("FAILED!")
  }
})

// GET
app.get("/api/v1/players/:uuid",  async (req, res, next) => {
  try {
    const file = fs.readFileSync(config.server.dataPath + '/' + req.params.uuid + ".dat", 'binary')
    mlog.info("get data (success)> " + req.params.uuid)
    res.setHeader('Content-Length', file.length)
    res.write(file, 'binary')
    res.end()
  } catch(err) {
    mlog.info("get data (failed)> " + req.params.uuid)
    res.status(404).send("FAILED!")
  }
})


// バックアップ
app.delete("/api/v1/players/:uuid",  async (req, res, next) => {
  try {
    fs.rename(config.server.dataPath + '/' + req.params.uuid + ".dat", config.server.dataPath + '/' + req.params.uuid + ".dat_", function (err) {
      if(err) {
        mlog.info("delete (failed)> " + req.params.uuid)
      } else {
        mlog.info("delete (success)> " + req.params.uuid)
      }
    })
    res.status(200).send("SUCCESS!")
  } catch(err) {
    res.status(404).send("FAILED!")
  }
})


const server = app.listen(config.server.port, function () {
  const host = server.address().address
  const port = server.address().port
  mlog.info("listening at port " + port)
})

process.on('uncaughtException', console.error)
