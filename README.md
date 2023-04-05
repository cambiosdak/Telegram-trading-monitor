# Telegram trading pannel
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

This bot is to monitor positions in real-time or when required. You can check your balance for **FUTURES USD-M** or **SPOT**. You can ask a chart of the requested symbol and, to be able to achieve this, the bot will create a local server on port ```3000```, run a script using [apexcharts](https://apexcharts.com/javascript-chart-demos/candlestick-charts/) and then use ``puppeteer`` to nagivate in a ``headless browser`` take a screenshot and send it as a message along with the respective position information. 
## Usage
Install these packages via npm:
```
npm install puppeteer axios crypto-js telegraf express
```

