// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '@@/plugin-antd-icon-config/app.ts';
import * as Plugin_1 from '/home/khaibq/blockchain/web/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_2 from '../plugin-initial-state/runtime';
import * as Plugin_3 from '/home/khaibq/blockchain/web/src/.umi/plugin-locale/runtime.tsx';
import * as Plugin_4 from '../plugin-model/runtime';

  plugin.register({
    apply: Plugin_0,
    path: '@@/plugin-antd-icon-config/app.ts',
  });
  plugin.register({
    apply: Plugin_1,
    path: '/home/khaibq/blockchain/web/src/.umi/plugin-dva/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: '/home/khaibq/blockchain/web/src/.umi/plugin-locale/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_4,
    path: '../plugin-model/runtime',
  });

export const __mfsu = 1;
