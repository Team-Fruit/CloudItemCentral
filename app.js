import mlog from "./logger/logger"
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const app = express()
// コンフィグを読み込み
const config = JSON.parse(fs.readFileSync('./server.config', 'utf8'))

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
app.put("/api/v1/players/:uuid", upload.single("player.dat"), async (req, res, next) => {
  mlog.info("put data > " + req.params.uuid)
  const {file} = req
  if (!file) {
    res.json({
      success: false
    })
  } else {
    res.json({
      success: true
    })
  }
})

// GET
app.get("/api/v1/players/:uuid",  async (req, res, next) => {
  try {
    mlog.info("get data > " + req.params.uuid)

    const file = fs.readFileSync(config.server.dataPath + '/' + req.params.uuid + ".dat", 'binary')
    res.setHeader('Content-Length', file.length)
    res.write(file, 'binary')
    res.end()

    fs.rename(config.server.dataPath + '/' + req.params.uuid + ".dat", config.server.dataPath + '/' + req.params.uuid + ".dat_", function (err) {
      if(err) {
        mlog.info("backup error > " + req.params.uuid)
      } else {
        mlog.info("backup success > " + req.params.uuid)
      }
    })
  } catch(err) {
    res.status(404)
  }
})

const server = app.listen(config.server.port, function () {
  const host = server.address().address
  const port = server.address().port
  mlog.info("listening at port " + port)
})

process.on('uncaughtException', console.error)
