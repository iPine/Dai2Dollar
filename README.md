## 项目背景
Dai​ 是价格锚定 1 美元左右的加密货币 (`1 Dai ~= 1 USD`)。`ETH` 是类似于比特币的加密货币。
- 项目功能：根据 ETH/Dai 和 ETH/USD 的价格，实时可视化 Dai 的美元价格和数量。

## Dai - USD 映射表
### 接口列表
- 获取 Dai-ETH 映射 CSV: [30 天](https://dai.stablecoin.science/data/ethdai-trades-30d.csv)，[7 天](https://dai.stablecoin.science/data/ethdai-trades-7d.csv)
- 获取 ETH-USD 报价: [根据coinmarketcap提供的API](https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD)
- coinmarketcap Key: `18effd32-0234-4c50-a3bb-805597dd638e`(调用次数限制 333次/天，10000次/月)，因为接口调用限制，在服务端暂存了 `ETH-USD` 价格，再次访问时间大于5分钟时，触发获取新的报价

### 运行
- 版本：`node.js >= 8`
- 安装依赖: `npm install` (npm会安装好所有依赖的包)
- 执行: `npm start`(默认执行端口 3000)
- 查看效果: http://localhost:3000/

## [这里是Demo](http://ipine.cc/Dai2Dollar/demo/index.html)
可视化效果的静态页面展示，无实时数据。
