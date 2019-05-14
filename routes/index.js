const fs = require("fs")
const rp = require('request-promise')
const router = require('koa-router')()
const MARK_KEY = '18effd32-0234-4c50-a3bb-805597dd638e'

// 获取eth-dai数据并调用换算函数解析成json格式的异步函数
async function readCsv(period) {
  let price = await getCurrentQuote() //获取eth-usd的价格
  let rqOption = {
    method: 'GET',
    uri: `https://dai.stablecoin.science/data/ethdai-trades-${period}d.csv`
  }
  try {
    let response = await rp(rqOption) //获取eth-dai的数据
    ConvertToTable(response, price.price, function (table) {
      console.log(`${period} done`)
      fs.writeFileSync(`./public/data/dai2usd-${period}.json`, JSON.stringify(table))
    })
    return response
  } catch (error) {
    return false
  }
}

// 换算函数
// 第一个参数：eth-dai的数据
// 第二个参数：eth-usd的价格，通过getCurrentQuot()函数得到
// 第三个参数：回调函数，将数据解析成json格式
function ConvertToTable(data, price, callBack) {
  data = data.toString()
  var table = new Array()
  var rows = new Array()
  rows = data.split("\r\n")
  let headerArr = rows[0].split(',') 
  for (var i = 1; i < rows.length; i++) {
    let item = {}
    rows[i].split(",").forEach((element, index) => {
      if (headerArr[index] === 'price') {
        item[headerArr[index]] = parseFloat(element) / price
      } else {
        item[headerArr[index]] = element
      }
    });
    table.push(item)
  }
  callBack(table)
}


// 获取eth-usd的价格异步函数
async function getCurrentQuote() {
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD',
    headers: {
      'X-CMC_PRO_API_KEY': MARK_KEY
    }
  }
  // data目录下time和price是缓存的最近的，用于判断刷新时间是否大于5分钟
  let time = parseInt(fs.readFileSync('./public/data/time', 'utf8'))
  // if (!time || new Date().getTime() - time > 300000) {
  console.log('时间超过 5 分钟，获取新数据')
  fs.writeFileSync('./public/data/time', new Date().getTime())
  try {
    let response = await rp(requestOptions)
    response = JSON.parse(response)
    let price = response.data.ETH.quote.USD
    fs.writeFileSync('./public/data/price', JSON.stringify(price))
    return price
  } catch (error) {
    console.log(error)
    let price = fs.readFileSync('./public/data/price', 'utf8')
    return JSON.parse(price)
  }
  // } else {
  //   console.log('时间低于 5 分钟，返回旧数据')
  //   let price = fs.readFileSync('./public/data/price', 'utf8')
  //   return JSON.parse(price)
  // }
}

// 解析成的json数据有两个，7天和30天
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Dai to USD'
  })
  let time = parseInt(fs.readFileSync('./public/data/time', 'utf8'))
  if (!time || new Date().getTime() - time > 300000) {
    readCsv(7)
    readCsv(30)
  }
})
module.exports = router