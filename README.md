# Telegram trading Monitor
## Description
This bot is only for ***BINANCE FUTURES***
Features on this bot:
+ Futures Information:
  + Total Initial Margin
  + Total Maint Margin
  + Wallet balance
  + Total Margin Balance
  + Total Cross UnPnl
  + Available Balance in USDT, BNB and BUSD
+ Position Informations
+ Convert USDT to BUSD (This is done on SPOT)
+ Convert BUSD to USDT (This is done on SPOT)
+ Transfer USDT to Spot
+ Transfer BUSD to Spot
+ Transfer USDT to Futures USD-M
+ Transfer BUSD to Futures USD-M
+ Get a chart (this is a fabricated chart with the information provided by Binance API)
+ Spot Balance
+ Get Updates (This is slow but will send a message for every open position with their respective chart and then update it every half hour)

This bot is to monitor positions in real-time or when required. You can check your balance for **FUTURES USD-M** or **SPOT**. You can ask a chart of the requested symbol and, to be able to achieve this, the bot will create a local server on port ```3000```, run a script using [apexcharts](https://apexcharts.com/javascript-chart-demos/candlestick-charts/) and then use ``puppeteer`` to nagivate in a ``headless browser`` take a screenshot and send it as a message along with the respective position information. Bot will also plot a position if there's an open position in the symbol of the requested chart.<br /><br />
Chart Example:<br />
<img width="484" alt="Screenshot 2023-04-05 161042" src="https://user-images.githubusercontent.com/116052862/230198667-75275b98-5ae7-4953-baeb-255affcff7d3.png">
<br />
Positions example:<br />
<img width="278" alt="Screenshot 2023-04-05 161144" src="https://user-images.githubusercontent.com/116052862/230199450-5ee1ff1b-e430-406f-a532-95e6425cc1df.png">

## Usage
Install these packages via npm:
```
npm install puppeteer axios crypto-js telegraf express
```
- Set your TOKEN API KEY in the ``main.js`` and you can change the timeframe for the charts changing ``timefr`` variable, default is ``1h``
- Set your ``apiKey`` and ``apiSecret``
- send the command ``/start``

## References
- [ApexCharts](https://apexcharts.com/javascript-chart-demos/candlestick-charts/)
- [Axios](https://www.npmjs.com/package/axios)
- [Crypto-js](https://www.npmjs.com/package/crypto-js)
- [Express](https://www.npmjs.com/package/express)
- [Puppeteer](https://www.npmjs.com/package/puppeteer)
- [Telegraf](https://www.npmjs.com/package/telegraf)
- [Binance Connector (SPOT)](https://www.npmjs.com/package/@binance/connector)
