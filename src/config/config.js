// 配置文件
import publicKey from './publicKey';
const NODE_ENV = process.env.NODE_ENV;
console.log('this node_env is ' + NODE_ENV);

const config = {
  // 内网配置
  dev: {
    publicKey: publicKey.dev,
    baseURL: 'https://admin-api.test.wyyt.cc/sijibao-operation',
    uploadURL: 'http://boot-service.dev.wyyt.cc',
    mobileUrl: 'http://admin-m.sijibao.co',
    env: 'dev',
    sysCtrl: {
      permission: true, // 是否校验权限
      tab: true, // 是否启用tab
      keepAlive: true // 是否启用页面缓存
    }
  },
  // 测试配置
  test: {
    publicKey: publicKey.test,
    baseURL: 'https://admin-api.test.wyyt.cc/sijibao-operation',
    uploadURL: 'https://boot-service.test.wyyt.cc',
    mobileUrl: 'http://admin-m.sijibao.co',
    env: 'test',
    sysCtrl: {
      permission: true,
      tab: true,
      keepAlive: true
    }
  },
  // 测试配置
  k8s: {
    publicKey: publicKey.test,
    baseURL: 'https://admin-api.wpub.test027.com/sijibao-operation',
    uploadURL: 'https://boot-service.wpub.test027.com',
    mobileUrl: 'http://admin-m.sijibao.co',
    env: 'k8s',
    sysCtrl: {
      permission: true,
      tab: true,
      keepAlive: true
    }
  },
  // 生产配置
  prod: {
    publicKey: publicKey.prod,
    baseURL: 'https://admin-api.sijibao.com/sijibao-operation',
    uploadURL: 'https://boot-service.sijibao.com',
    mobileUrl: 'http://admin-m.sijibao.com',
    env: 'prod',
    sysCtrl: {
      permission: true,
      tab: true,
      keepAlive: true
    }
  }
};

// 根据环境变量 导出对应配置
let envConfig = null;
if (NODE_ENV === 'development' || process.env.VUE_APP_BUILDENV === 'dev') {
  /**
   * debug_server -> 调试服务器
   * 在开发模式下 为方便调试  开发者可自行修改debug_server 用本地项目连接不同的目标服务器
   * debug_server：dev  开发服务器(默认)
   * debug_server：test 测试服务器
   * debug_server：prod 生产服务器
   */

  let envkey = localStorage.getItem('debug_server') || 'dev';
  if (envkey != 'dev' && envkey != 'test' && envkey != 'prod' && envkey != 'k8s') envkey = 'dev';

  envConfig = { ...config[envkey] };

  if (envkey === 'dev') {
    // 本机开发模式默认连接内网服务器
    // 若本地localStorage存在dev_host 则覆盖默认目标
    const dev_host = localStorage.getItem('dev_host') || '';

    if (dev_host) envConfig.baseURL = dev_host;
  }
} else {
  envConfig =
    process.env.VUE_APP_BUILDENV === 'test'
      ? { ...config.test }
      : process.env.VUE_APP_BUILDENV === 'k8s'
      ? { ...config.k8s }
      : { ...config.prod };
}

export default envConfig;
