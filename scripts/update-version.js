const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const currentVersion = require('../package.json').version;
const newVersion = getNewVersion(currentVersion);
const pkgRoot = path.resolve(__dirname, '../');

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function getNewVersion(currentVersion) {
  if (!currentVersion) return '0.0.1';

  const arr = currentVersion.split('.');
  if (arr[2] < 9) {
    arr[2] = +arr[2] + 1;
  } else if (arr[1] < 9) {
    arr[1] = +arr[1] + 1;
    arr[2] = 0;
  } else {
    arr[0] = +arr[0] + 1;
    arr[1] = 0;
    arr[2] = 0;
  }

  return arr.join('.');
}

try {
  // update version
  updatePackage(pkgRoot, newVersion);
  // add new package.json
  execSync(`git add package.json`);
} catch (e) {
  console.error('处理package.json失败，请重试', e.message);
  process.exit(1);
}
