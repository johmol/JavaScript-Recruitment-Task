const express = require('express')
const path = require('path')
const stocks = require('./stocks')

const app = express()
app.use(express.static(path.join(__dirname, 'static')))

app.get('/stocks', async (req, res) => {
  const stockSymbols = await stocks.getStocks()
  res.send({ stockSymbols })
})

app.get('/stocks/:symbol', async (req, res) => {
  const { params: { symbol } } = req
  const data = await stocks.getStockPoints(symbol, new Date())
  res.send(data)
})

app.listen(3000, () => console.log('Server is running!'))

async function LoadStocks() {
  try {
    const stockArr = await stocks.getStocks()
    stockArr.forEach(async stock => {
      let postFix = "Successfully loaded"
      let loaded = true;
      let stockData = await stocks.getStockPoints(stock, Date.now()).catch((error) => {postFix = "\nFailed to load"; loaded = false})

      if (!loaded)
        stockData = "...\n"
      else
        stock += ": "
      
      console.log(postFix, stock, stockData)
    })
  } catch (error) {
    console.error("Error", error)
  }
}



LoadStocks();