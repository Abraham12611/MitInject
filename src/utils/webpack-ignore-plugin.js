// Custom webpack plugin to ignore Trezor modules
class IgnoreTrezorPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    const handler = (parser) => {
      parser.hooks.import.tap('IgnoreTrezorPlugin', (statement, source) => {
        if (source.includes('@trezor') || source.includes('wallet-trezor')) {
          return true;
        }
      });

      parser.hooks.call.for('require').tap('IgnoreTrezorPlugin', (expression) => {
        if (expression.arguments.length === 0) return;
        const arg = expression.arguments[0];
        if (arg.type !== 'Literal') return;

        const value = arg.value;
        if (typeof value === 'string' && (value.includes('@trezor') || value.includes('wallet-trezor'))) {
          return true;
        }
      });
    };

    compiler.hooks.compilation.tap('IgnoreTrezorPlugin', (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.parser.for('javascript/auto').tap('IgnoreTrezorPlugin', handler);
      normalModuleFactory.hooks.parser.for('javascript/dynamic').tap('IgnoreTrezorPlugin', handler);
      normalModuleFactory.hooks.parser.for('javascript/esm').tap('IgnoreTrezorPlugin', handler);
    });
  }
}

module.exports = IgnoreTrezorPlugin;