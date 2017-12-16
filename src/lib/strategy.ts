import { DataProvider } from 'ns-findata';
import { Log } from 'ns-common';
import { Bar, LimitOrder, EventType, TradeType, OrderType, OrderSide } from 'ns-types';

const dataProvider = new DataProvider()

export class Strategy {
  static execute(symbol: string, ohlcData: Bar[]) { };
}

/** 短线阻击策略 */
export interface SniperSignal {
  k: number,
  d?: number,
  side?: OrderSide
}
export class SniperStrategy extends Strategy {
  static execute(symbol: string, ohlcData: Bar[]) {
    const kdList = dataProvider.getStochastic(ohlcData);
    if (kdList.length === 0) {
      return null;
    }
    const lastK = kdList[kdList.length - 1].k;
    if ((!lastK && lastK !== 0) || isNaN(lastK)) {
      Log.system.warn(`未计算出K值:${lastK}, 空值返回。`);
      Log.system.warn(`kdList:${JSON.stringify(kdList, null, 2)}, 空值返回`);
      return null;
    }
    const price = ohlcData[ohlcData.length - 1].close;
    if (!price) {
      return null;
    }
    const baseSignal = {
      k: lastK
    };

    const config = require('config').strategies.sniper;
    // 策略
    if (lastK < config.buy) {
      return <SniperSignal>Object.assign({
        side: OrderSide.Buy
      }, baseSignal);
    } else if (lastK > config.sell) {
      return <SniperSignal>Object.assign({
        side: OrderSide.Sell
      }, baseSignal);
    }
    return baseSignal;
  }
  constructor() {
    super()
  }
  execute() { }
}
