import * as assert from 'power-assert';
import { SniperStrategy } from './strategy';
import { GoogleFinance } from 'ns-findata';
import { Bar } from 'ns-types';

const testSniper = async (done: any) => {
  const opt = {
    q: '6553',
    x: 'TYO',
    p: '6M',
    i: 86400
  };
  const hisData = await GoogleFinance.getHistory(opt);
  console.log(
    'stock:%s\n...\n%s',
    JSON.stringify(hisData[0], null, 2),
    JSON.stringify(hisData[hisData.length - 1], null, 2)
  );
  const sniper = new SniperStrategy();
  const res = sniper.execute('6553', <Bar[]>hisData);
  console.log(res);
  done();
}

describe('ns-strategy', () => {
  it('短线阻击策略', function (done) {
    this.timeout(10000);
    testSniper(done);
  });
});
