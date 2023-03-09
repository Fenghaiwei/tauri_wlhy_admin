const execSync = require('child_process').execSync;
const os = require('os');
const { name } = require('../package.json');
const sonarServer = 'https://sonarqube.test027.com';
const sonarToken = 'sqa_dc31d8bba0622107ea1d01e0f01f9e75a5250b6e';

const exec = cmd => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.log('[' + cmd + ']命令执行失败');
    process.exit(1);
  }
};

// mac下的扫描命令
const macCommand = `sonar-scanner \
    -Dsonar.projectKey=${name} \
    -Dsonar.sources=. \
    -Dsonar.host.url=${sonarServer} \
    -Dsonar.login=${sonarToken} \
    -Dsonar.inclusions=src/**
`;

// windows下的扫描命令
const winCommand = `sonar-scanner.bat -D"sonar.projectKey=${name}" -D"sonar.sources=." -D"sonar.host.url=${sonarServer}" -D"sonar.login=${sonarToken}" -D"sonar.inclusions=src/**"`;

const platform = os.platform();
if (['linux', 'darwin'].includes(platform)) {
  exec(macCommand);
} else if (['win32'].includes(platform)) {
  exec(winCommand);
} else {
  console.log('unknown os');
}
