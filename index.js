const {Telegraf, Scenes:{WizardScene, Stage}, session, Markup} = require('telegraf')
const axios = require('axios')
const CryptoJS = require('crypto-js')
const bot = new Telegraf('1066350252:AAFsB1waUL6hGUoqB9JA2ZdJbG-0pO-r-xc')
var express = require('express')
var app = express();
const fs = require('fs')
const path = require('path')
let pathfile = path.join(__dirname, '/screenshot.png')
const symbols = require('./symbols.json')
const puppeteer = require('puppeteer')
app.set('view engine', 'ejs')
let timefr = '1h' //
app.listen(3000)
// Initialize telegram bot
bot.start((ctx) => {
    ctx.reply('What would you like to do?', 
	Markup.inlineKeyboard([
		[Markup.button.callback('Futures Information💵', 'wallet'),
		Markup.button.callback('Position Information🟢', 'pInfo')],
		[Markup.button.callback('Convert USDT to BUSD💱', 'convert'),
		Markup.button.callback('Convert BUSD to USDT💱', 'convertBUSD')],
		[Markup.button.callback('Transfer BUSD to Spot', 'spotTransferBUSD'),
		Markup.button.callback('Transfer USDT to Spot', 'SpotTransfer')],
		[Markup.button.callback('Transfer USDT to Futures📲', 'tFuturesUSDT'),
		Markup.button.callback('Transfer BUSD to Futures📲', 'tFutures')],
		[Markup.button.callback('Get Chart📉','getChart'),
		Markup.button.callback('Spot Balance💳', 'sWallet')],
		[Markup.button.callback('Get Updates', 'updates')]
	]).resize().oneTime()
	)
} )
const { Spot } = require('@binance/connector')
const apiKey = 'mH236IQihFGp22cQ7UegNhKLvNO56T9Lj7kqJB52FhsHC9d1rfLc2DaR57ru9dWQ'
const apiSecret = '6yD9xdR0BuuK6AEA8y4uSBJv0FZcOCVu0ey3gbId88RpRPptwRIxyE6o5Y4Voe5V'
const client = new Spot(apiKey, apiSecret)
// AMOUNT TO TRANSFER
let url = 'https://fapi.binance.com'
// Wallet Balance
bot.action('wallet', (ctx) =>{
	ctx.answerCbQuery()
	let parameter = `recvWindow=60000&timestamp=${Date.now()}`
	let signatureSymbol = CryptoJS.HmacSHA256(parameter, apiSecret).toString(CryptoJS.enc.Hex)
	var options = {
	  headers: {
		'X-MBX-APIKEY': `${apiKey}` // APIKEY OF ACCOUNT B
	},
	method: 'GET',
	url: `${url}/fapi/v2/account?${parameter}&signature=${signatureSymbol}`

	}
	axios.request(options).then(async response =>{
		await response.data
		rep = response.data
		ctx.replyWithHTML(`Total Initial Margin <b>${rep.totalInitialMargin}</b>\nTotal Maint Margin: <b>${rep.totalMaintMargin}</b>\nWallet balance: <b>${rep.totalWalletBalance}</b>\nTotal Margin Balance: <b>${rep.totalMarginBalance}</b>\nTotal Cross UnPnl: ${rep.totalCrossUnPnl}\nAvailable Balance <b>${rep.availableBalance}</b>`)
		response = response.data.assets
		for(i=0; i < response.length; i++){
			if(response[i].asset === 'BNB'){
				ctx.replyWithHTML(`Asset: <b>BNB</b>\nWallet Balance: <b>${response[i].walletBalance}</b>\nUnrealized Profit: <b>${response[i].unrealizedProfit}</b>\nMargin balance: <b>${response[i].marginBalance}</b>`)
			}
			if(response[i].asset === 'USDT'){
				ctx.replyWithHTML(`Asset: <b>USDT</b>\nWallet Balance: <b>${response[i].walletBalance}</b>\nUnrealized Profit: <b>${response[i].unrealizedProfit}</b>\nMargin balance: <b>${response[i].marginBalance}</b>`)
			}
			if(response[i].asset === 'BUSD'){
				ctx.replyWithHTML(`Asset: <b>BUSD</b>\nWallet Balance: <b>${response[i].walletBalance}</b>\nUnrealized Profit: <b>${response[i].unrealizedProfit}</b>\nMargin balance: <b>${response[i].marginBalance}</b>`)
			}
		}
	}).catch(error => console.log(error))
})
//HELP
bot.command('help', (ctx) => {
	ctx.answerCbQuery()
	ctx.reply('Type /start to make an action')
})
bot.action('sWallet', (ctx) => {
	ctx.answerCbQuery()
	client.userAsset()
  .then(async response => {
	await response.data
	for (const k of Object.values(response.data)){
		ctx.reply(`Asset: ${k.asset}\nAmount: ${k.free}`)
	}
  })
  .catch(error => client.logger.error(error))
})
bot.action('pInfo', (ctx) =>{
	ctx.answerCbQuery()
	ctx.replyWithHTML(`Checking open positions...`)
	let parameter = `recvWindow=60000&timestamp=${Date.now()}`
	let signatureSymbol = CryptoJS.HmacSHA256(parameter, apiSecret).toString(CryptoJS.enc.Hex)
	var options = {
	headers: {
		'X-MBX-APIKEY': `${apiKey}` // APIKEY OF ACCOUNT B
	},
	method: 'GET',
	url: `${url}/fapi/v2/positionRisk?${parameter}&signature=${signatureSymbol}`

	}
	axios.request(options).then(async response =>{
		await response.data
		current = response.data
	if (current != undefined){
		for (let i = 0; i < current.length; i++) {
		setTimeout(() => {
				if (current[i].positionAmt > 0.00001){
					ctx.replyWithHTML(`Symbol: <b>${current[i].symbol}</b>\nSide: LONG\n\nLeverage: <b>${current[i].leverage}</b>\nuPnL: <b>${current[i].unRealizedProfit}</b>\nPosition Amount: <b>${Math.abs(current[i].positionAmt)}</b>\nNotional: <b>${current[i].notional}</b>\nIsolated Wallet: <b>${current[i].isolatedWallet}</b>\nMark Price: <b>${current[i].markPrice}</b>\nLiquidation Price: <b>${current[i].liquidationPrice}</b>`)
				} else if(current[i].positionAmt < -0.000001){
					ctx.replyWithHTML(`Symbol: <b>${current[i].symbol}</b>\n\nSide: SHORT\n\nLeverage: <b>${current[i].leverage}</b>\nuPnL: <b>${current[i].unRealizedProfit}</b>\nPosition Amount: <b>${Math.abs(current[i].positionAmt)}</b>\nNotional: <b>${Math.abs(current[i].notional)}</b>\nIsolated Wallet: <b>${current[i].isolatedWallet}</b>\nMark Price: <b>${current[i].markPrice}</b>\nLiquidation Price: <b>${current[i].liquidationPrice}</b>`)
				}
			}, 150*i);
		}
	}
	}).catch(error => console.log(error))
})
const PERIOD = Telegraf.on('callback_query', (ctx) =>{
	ctx.answerCbQuery()
	let timeframe
	if (ctx.update.callback_query.data === '4h'){
		timeframe = '4h'
	} else if(ctx.update.callback_query.data === '2h'){
		timeframe = '2h'
	} else if(ctx.update.callback_query.data === '1h'){
		timeframe = '1h'
	} else if(ctx.update.callback_query.data === '15m'){
		timeframe = '15m'
	}
	app.get('/', (req, res, next) => {
		res.render('index.ejs', {symbol: `${ctx.scene.state.symbol}`, timeframe: `${timeframe}`, apiSecret: `${apiSecret}`, apiKey: `${apiKey}`})
	}); 
	const Screenshot = async () => {                // Define Screenshot function	 
	const browser = await puppeteer.launch();    // Launch a "browser"	 
	const page = await browser.newPage();        // Open a new page	 
	await page.goto('http://localhost:3000')                        // Go to the website	 
	await page.waitForTimeout(6000)
	await page.screenshot({                      // Screenshot the website using defined options	 
		path: "./screenshot.png",                   // Save the screenshot in current directory	 
		fullPage: true                              // take a fullpage screenshot	 
	})
	await page.close();
	await browser.close();
	ctx.replyWithPhoto({source: pathfile})
	ctx.scene.leave()
	}
	Screenshot()
	setTimeout(() =>{
		fs.unlinkSync(pathfile)
	}, 8000)
})
const CHART_SYMBOL = Telegraf.hears(/[A-Z]+$/, (ctx) => {
	for (const k of Object.values(symbols)){
		if (k == ctx.message.text){
			ctx.scene.state.symbol = ctx.message.text
			console.log(ctx.scene.state.symbol)
		}
	}
	ctx.reply('What timeframe would you like?', Markup.inlineKeyboard([
		[Markup.button.callback('4h', '4h'), Markup.button.callback('2h', '2h'), Markup.button.callback('1h', '1h'),Markup.button.callback('15m', '15m')]
	]).resize().oneTime()
	)
	ctx.wizard.next()
})
const CONVERT_USDT = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	client.newOrder('BUSDUSDT', 'BUY', 'MARKET', {
		quantity: `${ctx.message.text}`
	  }).then(async response =>{
		await response.data
		ctx.reply(`${ctx.message.text} USDT succesfully converted to BUSD`)
	  }).catch(error =>{
		ctx.reply(`USDT could not be converted, please make sure you have enough USDT on your wallet or put a lower amount`)
		console.log(error)
		})
})
const TRANSFER_FUTURES = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	 client.futuresTransfer('BUSD', `${ctx.message.text}`, 1)
  .then(async response => {
	await response.data
	ctx.replyWithHTML(`<b>${ctx.message.text}</b> Succesfully transfered to your Futures Wallet`)
  }).catch(error => {
	ctx.replyWithHTML(`BUSD could not be transfered to your Futures Wallet, please make sure you have enough BUSD on your <b>SPOT</b> wallet or put a lower amount`)
	console.log(error)
	})
})
const TRANSFER_FUTURES_USDT = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	client.futuresTransfer('USDT', `${ctx.message.text}`, 1)
 .then(async response => {
   await response.data
   ctx.replyWithHTML(`<b>${ctx.message.text}</b> Succesfully transfered to your Futures Wallet`)
 }).catch(error => {
   ctx.replyWithHTML(`BUSD could not be transfered to your Futures Wallet, please make sure you have enough BUSD on your <b>SPOT</b> wallet or put a lower amount`)
   console.log(error)
   })
})
const SYMBOL = Telegraf.hears(/^[A-Z0-9]+$/, (ctx) => {
	const pair = ctx.message.text;
	for (i = 0; i < symbols.length; i++) {
	  if (pair == symbols[i]) {
		ctx.wizard.state.symbol = pair;
		ctx.replyWithHTML(
		  "Please indicate the side <b>SHORT</b> or <b>LONG</b>",
		  Markup.inlineKeyboard([
			Markup.button.callback("SHORT", "short"),
			Markup.button.callback("LONG", "long")])
		)
	  }
	}
	return ctx.wizard.next();
});
  
const ORDER_SIDE = Telegraf.on("callback_query", (ctx) => {
	if (ctx.update.callback_query.data == "long") {
		ctx.wizard.state.compra = "BUY";
		ctx.reply("Please indicate your leverage, ex: 10, 20, 30");
	} else if (ctx.update.callback_query.data == "short") {
		ctx.wizard.state.venta = "SELL";
		ctx.reply("Please indicate your leverage, ex: 10, 20, 30");
	}
	return ctx.wizard.next();
});
const LEVERAGE = Telegraf.hears(/^[0-9]+$/, (ctx) => {
	let params = `symbol=${ctx.wizard.state.symbol}&leverage=${ctx.message.text}&recvWindow=60000&timestamp=${Date.now()}`
          let signatureLeverage = CryptoJS.HmacSHA256(params, apiSecret).toString(CryptoJS.enc.Hex)
          let lev = {
              headers: {
                  'X-MBX-APIKEY': `${apiKey}` // APIKEY OF ACCOUNT B
              },
              method: 'POST',
              url: `https://fapi.binance.com/fapi/v1/leverage?${params}&signature=${signatureLeverage}`
          }
         axios.request(lev).then(async (response) => {
              await response.data
              ctx.wizard.state.leverage = response.data.leverage
              ctx.reply('Please indicate the size of your order (USDT)')
			return ctx.wizard.next()
          }).catch(error => console.error(error))
})
const AMOUNT = Telegraf.hears(/^\d+(\.\d+)?$/, (ctx) => {
	ctx.wizard.state.amount = Number(ctx.message.text);
	  let side;
	  if (ctx.wizard.state.venta != undefined) {
		side = "SELL";
	  } else if (ctx.wizard.state.compra != undefined) {
		side = "BUY";
	  }
	  let parameter = `symbol=${ctx.wizard.state.symbol}&recvWindow=5000&timestamp=${Date.now()}`
	  let signatured = CryptoJS.HmacSHA256(parameter,apiSecret).toString(CryptoJS.enc.Hex);
	  let price = {
		headers: {
		  "X-MBX-APIKEY": `${apiKey}`, // APIKEY OF ACCOUNT B
		},
		method: "GET",
		url: `https://fapi.binance.com/fapi/v1/ticker/price?${parameter}&signature=${signatured}`,
	  };
	  axios.request(price).then(async (response) => {
		  ctx.wizard.state.price = response.data.price
		}).then((resp) => {
			let parameter = `symbol=${ctx.wizard.state.symbol}&recvWindow=60000&timestamp=${Date.now()}`
			let signatureSymbol = CryptoJS.HmacSHA256(parameter, apiSecret).toString(CryptoJS.enc.Hex)
			var options = {
			  headers: {
				'X-MBX-APIKEY': `${apiKey}` // APIKEY OF ACCOUNT B
			},
			method: 'GET',
			url: `${url}/fapi/v1/exchangeInfo?${parameter}&signature=${signatureSymbol}`
	
			}
			axios.request(options).then(async response =>{
				await response.data
				info = response.data.symbols
				for (const k of Object.values(info)){
				if (k.symbol === ctx.wizard.state.symbol){
					ctx.wizard.state.precision = k.quantityPrecision
				}
			}
			
  		}).then(response =>{
			let qty = (ctx.wizard.state.leverage*(ctx.wizard.state.amount / ctx.wizard.state.price))
			  let params = `symbol=${ctx.wizard.state.symbol}&side=${side}&type=MARKET&quantity=${qty.toFixed(ctx.wizard.state.precision)}&recvWindow=5000&timestamp=${Date.now()}`;
			  let signature = CryptoJS.HmacSHA256(params, apiSecret).toString(CryptoJS.enc.Hex);
			  var options = {
				headers: {
				  "X-MBX-APIKEY": `${apiKey}`, // APIKEY OF ACCOUNT B
				},
				method: "POST",
				url: `${url}/fapi/v1/order?${params}&signature=${signature}`,
			  };
			  axios.request(options).then(async (response) => {
				  await response.data;
				  ctx.reply("Orden Market enviada!");
					}).catch((error) => console.error(error))
				}).catch((error) => console.error(error));
		}).catch(error => console.error(error))
})
const CONVERT_BUSD_USDT = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	client.newOrder('BUSDUSDT', 'SELL', 'MARKET', {
		quantity: `${ctx.message.text}`
	  }).then(async response =>{
		await response.data
		ctx.reply(`${ctx.message.text} BUSD succesfully converted to USDT`)
	  }).catch(error =>{
		ctx.reply(`BUSD could not be converted, please make sure you have enough BUSD on your wallet or put a lower amount`)
		console.log(error)
		})
})
const FUTURES_TO_SPOT = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	client.futuresTransfer('USDT', `${ctx.message.text}`, 2)
 .then(async response => {
   await response.data
   ctx.replyWithHTML(`<b>${ctx.message.text}</b> Succesfully transfered to your Spot Wallet`)
 }).catch(error => {
   ctx.replyWithHTML(`USDT could not be transfered to your Futures Wallet, please make sure you have enough USDT on your <b>SPOT</b> wallet or put a lower amount or check console for error`)
   console.log(error)
   })
})
const FUTURES_TO_SPOT_BUSD = Telegraf.hears(/^[0-9]*(\.[0-9]{0,2})?$/, (ctx) => {
	client.futuresTransfer('BUSD', `${ctx.message.text}`, 2)
 .then(async response => {
   await response.data
   ctx.replyWithHTML(`<b>${ctx.message.text}</b> Succesfully transfered to your Spot Wallet`)
 }).catch(error => {
   ctx.replyWithHTML(`BUSD could not be transfered to your Futures Wallet, please make sure you have enough BUSD on your <b>SPOT</b> wallet or put a lower amount or check console for error`)
   console.log(error)
   })
})
// Convert USDT TO BUSD
const ConvertUSDTtoBUSD = new WizardScene('convertUSDT', CONVERT_USDT)
ConvertUSDTtoBUSD.enter(ctx => ctx.reply('How much would you like to convert to BUSD?'))
// Convert BUSD TO USDT
const ConvertBUSDtoUSDT = new WizardScene('convertBUSD', CONVERT_BUSD_USDT)
ConvertBUSDtoUSDT.enter(ctx => ctx.reply('How much would you like to convert USDT?'))
// Transfer BUSD to Futures
const TransferFutures = new WizardScene('trasnferFutures', TRANSFER_FUTURES)
TransferFutures.enter(ctx => ctx.reply('How much BUSD would you like to transfer to your Futures Wallet?'))
// Transfer USDT to Futures
const TransferFuturesUSDT = new WizardScene('trasnferFutures', TRANSFER_FUTURES_USDT)
TransferFuturesUSDT.enter(ctx => ctx.reply('How much USDT would you like to transfer to your Futures Wallet?'))
//  Get Chart
const GetCharts = new WizardScene('getChart', CHART_SYMBOL, PERIOD)
GetCharts.enter(ctx => {
	ctx.replyWithHTML('What symbol would you like to take a look?')
})
// New Order
const NEW_ORDER = new WizardScene('newOrder', SYMBOL, ORDER_SIDE, LEVERAGE, AMOUNT)
NEW_ORDER.enter(ctx => ctx.reply('What symbol would you like to send an order?'))
// Spot transfer
const TransferSPOTUSDT = new WizardScene('spotTransfer', FUTURES_TO_SPOT)
TransferSPOTUSDT.enter(ctx => ctx.reply('How much USDT would you like to transfer to your Spot Wallet?'))
// Spot transfer BUSD
const TransferSPOTBUSD = new WizardScene('spotTransferBUSD', FUTURES_TO_SPOT_BUSD)
TransferSPOTBUSD.enter(ctx => ctx.reply('How much BUSD would you like to transfer to your Spot Wallet?'))
/**
 ******* Para ejecutar las scene necesitas los Stage ************ 
 ******* Sin el session(), no inicia el scene
 */
// Stage handler
const stage = new Stage([ConvertUSDTtoBUSD, TransferFutures, GetCharts, NEW_ORDER, ConvertBUSDtoUSDT,TransferFuturesUSDT,TransferSPOTUSDT])
stage.hears('cancelar', ctx => ctx.scene.leave)
bot.use(session(),stage.middleware())
bot.action('convertBUSD', (ctx) => {
	ctx.answerCbQuery()
	ctx.scene.enter('convertBUSD')
})

bot.action('convert', (ctx) => {
	ctx.answerCbQuery()
	ctx.scene.enter('convertUSDT')
})
bot.action('tFutures', (ctx) =>	{
	ctx.answerCbQuery()
	ctx.scene.enter('trasnferFutures')
})
bot.action('getChart', (ctx) => {
	ctx.answerCbQuery()
	ctx.scene.enter('getChart')
})
bot.action('newOrder', (ctx) => {
	ctx.answerCbQuery()
	ctx.scene.enter('newOrder')
})
bot.action('tFuturesUSDT', (ctx) =>	{
	ctx.answerCbQuery()
	ctx.scene.enter('trasnferFutures')
})
bot.action('SpotTransfer', (ctx) =>	{
	ctx.answerCbQuery()
	ctx.scene.enter('spotTransfer')
})
bot.action('spotTransferBUSD', (ctx) =>	{
	ctx.answerCbQuery()
	ctx.scene.enter('spotTransferBUSD')
})

bot.action('updates', (ctx) =>{
	ctx.answerCbQuery()
	let symbolTest
	let entry
	function positions() {
		ctx.reply('Checking for positions...')
		let parameter = `recvWindow=60000&timestamp=${Date.now()}`
		let signatureSymbol = CryptoJS.HmacSHA256(parameter, apiSecret).toString(CryptoJS.enc.Hex)
		var options = {
		headers: {
			'X-MBX-APIKEY': `${apiKey}` // APIKEY OF ACCOUNT B
		},
		method: 'GET',
		url: `${url}/fapi/v2/positionRisk?${parameter}&signature=${signatureSymbol}`
	
		}
		axios.request(options).then(async response =>{
			await response.data
			current = response.data
		if (current != undefined){
			for (let i = 0; i < current.length; i++) {
				setTimeout(() => {
					if (current[i].positionAmt > 0.00001){
						symbolTest = current[i].symbol
						entry = current[i].entryPrice
						app.get('/', (req, res, next) => {
							console.log(symbolTest)
							res.render('updater.ejs', {symbol: symbolTest, timeframe: `${timefr}`, apiSecret: `${apiSecret}`, apiKey: `${apiKey}`,  position: `${entry}`})
						}); 
						const Screenshot = async () => {                // Define Screenshot function	 
						const browser = await puppeteer.launch();    // Launch a "browser"	 
						const page = await browser.newPage();   // Open a new page	 
						await page.goto('http://localhost:3000') 	// Go to the website
						await page.waitForTimeout(6000)
						ctx.replyWithHTML(`Symbol: <b>${current[i].symbol}</b>\nSide: LONG\n\nEntry price: <b>${current[i].entryPrice}</b>\nLeverage: <b>${current[i].leverage}</b>\nuPnL: <b>${current[i].unRealizedProfit}</b>\nPosition Amount: <b>${Math.abs(current[i].positionAmt)}</b>\nNotional: <b>${current[i].notional}</b>\nIsolated Wallet: <b>${current[i].isolatedWallet}</b>\nMark Price: <b>${current[i].markPrice}</b>\nLiquidation Price: <b>${current[i].liquidationPrice}</b>`)
						await page.screenshot({                      // Screenshot the website using defined options	 
							path: "./screenshot.png",                   // Save the screenshot in current directory	 
							fullPage: true                              // take a fullpage screenshot	 
						})
						await page.close();
						await browser.close();
						await ctx.replyWithPhoto({source: pathfile})
						
						}
						Screenshot();
					} else if(current[i].positionAmt < -0.000001){
						symbolTest = current[i].symbol
						entry = current[i].entryPrice
						app.get('/', (req, res, next) => {
							res.render('updater.ejs', {symbol: symbolTest, timeframe: `${timefr}`, apiSecret: `${apiSecret}`, apiKey: `${apiKey}`,  position: `${entry}`})
						}); 
						const Screenshot = async () => {                // Define Screenshot function	 
						const browser = await puppeteer.launch();    // Launch a "browser"	 
						const page = await browser.newPage();        // Open a new page	 
						await page.goto('http://localhost:3000')	// Go to the website
						await page.waitForTimeout(6000)
						ctx.replyWithHTML(`Symbol: <b>${current[i].symbol}</b>\n\nSide: SHORT\n\nLeverage: <b>${current[i].leverage}</b>\nEntry price: <b>${current[i].entryPrice}</b>\nuPnL: <b>${current[i].unRealizedProfit}</b>\nPosition Amount: <b>${Math.abs(current[i].positionAmt)}</b>\nNotional: <b>${Math.abs(current[i].notional)}</b>\nIsolated Wallet: <b>${current[i].isolatedWallet}</b>\nMark Price: <b>${current[i].markPrice}</b>\nLiquidation Price: <b>${current[i].liquidationPrice}</b>`)
						await page.screenshot({                      // Screenshot the website using defined options	 
							path: "./screenshot.png",                 // Save the screenshot in current directory	 
							fullPage: true                              // take a fullpage screenshot	 
						})
						await page.close();
						await browser.close();
						await ctx.replyWithPhoto({source: pathfile}) //  
						
						}
						Screenshot()
					} else if (i == current.length -1){
						ctx.reply('I will update on 30 mins >D')
						i = 0
						positions()
					}
				}, 9000*i)
			}
		}
		}).catch(error => console.log(error))
	}
	positions()
})


bot.launch()