const XLSX = require('xlsx')
const express = require('express')
const app = express()
const _ = require('lodash')
const pretty = require('express-prettify')
const fileUpload = require('express-fileupload')
const fs = require('fs')

app.use(pretty({ query: 'pretty' }))
app.use('/', express.static('public'))
app.use(fileUpload())

app.locals.fileUri = ''

// 파일업로드
app.post('/upload', (req, res, next) => {
  if (!req.files) return res.status(400).send('No files were uploaded.')

  let sampleFile = req.files.sampleFile
  if(sampleFile.mimetype !== 'application/vnd.ms-excel') {
    return res.status(500).send('파일타입이 잘못되었습니다')
  }

  sampleFile.mv(`uploadFiles/${sampleFile.name}`, function(err) {
    if (err) return res.status(500).send(err)

    app.locals.fileUri = `uploadFiles/${sampleFile.name}`
    next()
  })
}, (req, res) => {
  const uploadedJson = xlsxToJson(app.locals.fileUri)

  fs.readFile('data/db.json', 'utf-8', function(err, data) {
    if (err) return res.status(500).send(err)
 
    let jsonDB = JSON.parse(data)
    let compfiledJson = _.unionBy(jsonDB.sim, uploadedJson, 'id')
    let jsonFormatDB = JSON.stringify({'sim': compfiledJson})

    fs.writeFile('data/db.json', jsonFormatDB, err => {
      if (err) return res.status(500).send(err)

      res.redirect('/upload.html')
    })

    app.locals.fileUri = ''
  })
})

// 파일 다운로드
// TODO 파일 생성해서 다운로드 하게 해놨는데 생성된 파일은 삭제하거나 browser에서 엑셀파일 다운로드하게 하든가 해야겠음
app.get('/download', (req, res) => {
  const filename = Date.now()
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send(err)

    const jsonDB = JSON.parse(data)
    const sheet = XLSX.utils.json_to_sheet(jsonDB.sim, {
      header:['id','구매자명','구매자ID','수취인명','주문상태','옵션정보1','옵션정보2','옵션정보3','수량','수취인연락처1','수취인연락처2','배송지','구매자연락처','우편번호','배송메세지']
    })

    const workbook = XLSX.utils.sheet_to_csv(sheet)

    fs.writeFile(`uploadFiles/${filename}.csv`, workbook, 'utf-8', err => {
      if (err) return res.status(500).send(err)
      res.download(`uploadFiles/${filename}.csv`)
    })
  })
})

// 엑셀파일 컨버터
app.get('/api/converter', (req, res) => {
  res.json(xlsxToJson('files/src.xls'))
})

// 엑셀문서를 JSON으로 바꾼다
function xlsxToJson(uri) {
  const workbook = XLSX.readFile(uri)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(worksheet)

  return _.map(data, item => {
    const opts = optFomart(item['옵션정보'])

    return {
      'id': item['상품주문번호'],
      '구매자명': item['구매자명'],
      '구매자ID': item['구매자ID'],
      '수취인명': item['수취인명'],
      '주문상태': item['주문상태'],
      // '옵션정보': item['옵션정보'],
      '옵션정보1': opts[0],
      '옵션정보2': opts[1],
      '옵션정보3': opts[2],
      '수량': item['수량'],
      '수취인연락처1': item['수취인연락처1'],
      '수취인연락처2': item['수취인연락처2'],
      '배송지': item['배송지'],
      '구매자연락처': item['구매자연락처'],
      '우편번호': item['우편번호'],
      '배송메세지': item['배송메세지']
    }
  })
}

// 옵션정보 가공
function optFomart(str) {
  if(!str.match('현지도착 일자 및 시간')) {
    return [str, '', '']
  }

  let arr = []
  let tmp = str.replace('현지도착 일자 및 시간(예: 12/8 13시):', '')
  tmp = tmp.split('/ 귀국 일자 및 비행시간(예:12/10 23시):')
  arr.push(tmp[0])

  let tmp2 = tmp[1].split('/ 입국공항(예:하노이/호치민/다낭 등):')
  arr.push(tmp2[0])
  arr.push(tmp2[1])

  return _.map(arr, item => item.trim(' '))
}

app.listen(8888, () => console.log('Example app listening on port 8888!'))