// This script patches the wallet-strategy package to remove its dependency on wallet-trezor
const fs = require('fs');
const path = require('path');

// Path to the wallet-strategy index.js file
const strategyIndexPath = path.resolve(__dirname, '../../node_modules/@injectivelabs/wallet-strategy/dist/esm/strategy/index.js');

// Check if the file exists
if (fs.existsSync(strategyIndexPath)) {
  // Read the file
  let content = fs.readFileSync(strategyIndexPath, 'utf8');

  // Replace imports of wallet-trezor
  content = content.replace(/import.*from.*wallet-trezor.*$/gm, '// Trezor import removed');

  // Replace any usage of TrezorWalletStrategy
  content = content.replace(/TrezorWalletStrategy/g, '/* TrezorWalletStrategy */ null');

  // Write the file back
  fs.writeFileSync(strategyIndexPath, content);

  console.log('Successfully patched wallet-strategy to remove Trezor dependency');
} else {
  console.error('Could not find wallet-strategy index.js file');
}

// Also patch the wallet-strategy package.json to remove the wallet-trezor dependency
const packageJsonPath = path.resolve(__dirname, '../../node_modules/@injectivelabs/wallet-strategy/package.json');

if (fs.existsSync(packageJsonPath)) {
  // Read the package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Remove the wallet-trezor dependency
  if (packageJson.dependencies && packageJson.dependencies['@injectivelabs/wallet-trezor']) {
    delete packageJson.dependencies['@injectivelabs/wallet-trezor'];

    // Write the package.json back
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log('Successfully removed wallet-trezor dependency from wallet-strategy package.json');
  }
} else {
  console.error('Could not find wallet-strategy package.json file');
}