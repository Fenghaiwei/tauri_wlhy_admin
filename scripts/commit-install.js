const execSync = require('child_process').execSync;
const os = require('os');
const exec = cmd => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.log('[' + cmd + ']命令执行失败');
    process.exit(1);
  }
};

//  全局安装commitizen
exec('npm add commitizen -g');

//  执行husky install
exec('npm run husky:install');

if (['linux', 'darwin'].includes(os.platform())) {
  //  mac、linux环境下需要设置可执行权限
  exec('chmod 777 .husky/*');
}
