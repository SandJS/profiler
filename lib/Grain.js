/**
 * Module Dependencies
 */

"use strict";

const SandGrain = require('sand-grain');
const Profiler = require('./Profiler');

let profilers = {};

/**
 * Initialize a new `Profiler`.
 *
 * @api public
 */
class Grain extends SandGrain {
  constructor() {
    super();
    this.name = this.configName = 'profiler';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  logRequest(res) {
    if (!res._profiler) {
      res._profiler = new Profiler();
      return;
    }

    if (this.enabled) {
      res._profiler.log();
    }
  }

  profile(name) {
    // Are we in a request?
    if (sand.context) {
      if (sand.context.res && sand.context.res._profiler) {
        return sand.context.res._profiler.profile(name);
      }
    }

    if (!this._profiler) {
      this._profiler = new Profiler();
    }

    return this._profiler.profile(name);
  }

  get enabled() {
    return this.config.enabled || (sand.context && sand.context.queryInt && (sand.context.queryInt('sand.profiler.enable') || false));
  }
}

module.exports = exports = Grain;