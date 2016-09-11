"use strict";

const Timer = require('./Timer');
const _ = require('lodash');
const Table = require('cli-table');
const diffHRTime = require('diff-hrtime');

class Profiler {
  constructor() {
    this.timers = {};
    this.id = 0;
  }

  profile(name) {
    return this.addTimer(new Timer(name));
  }

  addTimer(timer) {
    if (!this.timers[timer.name]) {
      this.timers[timer.name] = [];
    }

    this.timers[timer.name].push(timer);

    return timer;
  }

  log() {
    let stats = [];
    _.each(this.timers, function(value, name) {
      //console.log(value);
      stats.push(_.merge({
        name: name
      }, Profiler.calcStatsForTimers(value)))
    }, this);

    Profiler.logStats(stats)
  }

  static logStats(stats) {
    let table = new Table({
      head: Object.keys(stats[0]),
      style: {
        compact: true,
        head: ['cyan']
      }
    });

    _.each(stats, function(stat) {
      table.push(Object.keys(stat).map(function(key) {
        return stat[key];
      }));
    });

    sand.profiler.log('\n' + table.toString());
  }

  static calcStatsForTimers(timers) {
    let stats = {
      min: -1,
      max: 0,
      cum: 0,
      total: 0,
      count: timers.length,
      start: 0,
      end: 0
    };

    for (let timer of timers) {
      let time = timer.total;
      if (stats.min === -1 || time < stats.min) {
        stats.min = time;
      }

      if (time > stats.max) {
        stats.max = time;
      }

      stats.cum += time;

      if (!stats.start || timer._startTime < stats.start) {
        stats.start = timer._startTime;
      }

      if (!stats.end || timer._endTime > stats.end) {
        stats.end = timer._endTime;
      }
    }

    stats.min = float(stats.min);
    stats.max = float(stats.max);
    stats.cum = float(stats.cum);

    let total = diffHRTime(stats.start, stats.end);
    total = (total[0] * 1e9 + total[1]) / 1e9;
    stats.total = float(total);

    delete stats.start;
    delete stats.end;

    return stats;
  }
/*
  logRequest(res) {
    if (!res._profiler) {
      res._profiler = true;
      return;
    }

    this.log(res._profiler);
  }


  restart(id) {
    this.stop(id);
    return this.start();
  }

  append(num) {
    clearTimeout(this.logTimeout);
    this.sum += num;
    this.sum2 += num * num;
    this.count ++;
    return this;
  }

  reset() {
    this.sum = 0;
    this.sum2 = 0;
    this.count = 0;
    return this;
  }

  get avg() {
    return this.count > 0 ? this.sum / this.count : 0;
  }

  get std() {
    return this.count > 0 ? Math.sqrt(this.sum2 / this.count - Math.pow(this.avg, 2)) : 0;
  }

  log() {
    console.log(this.name, {sum: float(this.sum), count: this.count, avg: float(this.avg), std: float(this.std)});
    return this;
  }

  logAfter(time, post) {
    this.logTimeout = setTimeout(function () {
      this.log();
      this.reset();
    }.bind(this), time || 1000);
    return this;
  }
  */
}

module.exports = Profiler;

function float(num) {
  return parseFloat(num.toFixed(3));
}