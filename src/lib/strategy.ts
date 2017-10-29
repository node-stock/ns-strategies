import { DataProvider } from 'ns-findata';
import { Bar, LimitOrder, EventType, TradeType, OrderType, OrderSide } from 'ns-types';

const dataProvider = new DataProvider()

export class Strategy {
  static execute(symbol: string, ohlcData: Bar[]) { };
}

/** 短线阻击策略 */
export interface SniperSingal {
  k: number,
  d?: number,
  side?: OrderSide
}
export class SniperStrategy extends Strategy {
  static execute(symbol: string, ohlcData: Bar[]) {
    const kdList = dataProvider.getStochastic(ohlcData);
    if (kdList.length === 0) {
      throw new Error(`未算出K值：${JSON.stringify(ohlcData)}`);
    }
    const lastK = kdList[kdList.length - 1].k;
    if (!lastK) {
      throw new Error(`短线阻击策略, 获取K值异常：${lastK}`);
    }
    const price = ohlcData[ohlcData.length - 1].close;
    if (!price) {
      throw new Error(`短线阻击策略, 当前股价异常：${price}`)
    }
    const baseSingal = {
      k: lastK
    };

    const config = require('config').strategies.sniper;
    // 策略
    if (lastK < config.buy_k) {
      return <SniperSingal>Object.assign({
        side: OrderSide.Buy
      }, baseSingal);
    } else if (lastK > config.sell_k) {
      return <SniperSingal>Object.assign({
        side: OrderSide.Sell
      }, baseSingal);
    }
    return baseSingal;
  }
  constructor() {
    super()
  }
  execute() { }
}
