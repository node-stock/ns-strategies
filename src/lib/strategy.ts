import { DataProvider } from 'ns-findata';
import { Log } from 'ns-common';
import { Bar, OrderType, OrderSide } from 'ns-types';

const dataProvider = new DataProvider()

export class Strategy {
  static execute(ohlcData: Bar[]) { };
}

/** 短线阻击策略 */
export interface ISniperStrategy {
  k: number,
  d?: number,
  side?: OrderSide
}

export class SniperStrategy extends Strategy {
  static execute(ohlcData: Bar[]): ISniperStrategy | undefined {
    if (!ohlcData || ohlcData.length == 0 || ohlcData[ohlcData.length - 1].volume === 0) {
      return;
    }
    const kdList = dataProvider.getStochastic(ohlcData);
    if (kdList.length === 0) {
      return;
    }
    const lastK = kdList[kdList.length - 1].k;
    if (!lastK && lastK !== 0) {
      Log.system.warn(`未计算出K值:${lastK}, 空值返回。`);
      Log.system.warn(`kdList:${JSON.stringify(kdList[kdList.length - 1], null, 2)}, 空值返回`);
      return;
    }
    const price = ohlcData[ohlcData.length - 1].close;
    if (!price) {
      return;
    }
    const baseSignal = {
      k: lastK
    };

    const config = require('config').strategies.sniper;
    // 策略
    if (lastK < config.buy) {
      return <ISniperStrategy>Object.assign({
        side: OrderSide.Buy
      }, baseSignal);
    } else if (lastK > config.sell) {
      return <ISniperStrategy>Object.assign({
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
