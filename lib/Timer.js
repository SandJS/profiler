"use strict";

class Timer {
  constructor(name) {
    this.name = name;
    this.times = [];
    this._time = null;
    this._startTime = process.hrtime();
    this._endTime = null;
    this.startTime();
  }

  startTime() {
    this._time = process.hrtime();
  }

  recordTime() {
    if (this._time) {
      let diff = process.hrtime(this._time);
      diff = (diff[0] * 1e9 + diff[1]) / 1e9;
      this.times.push(diff);
      this._time = null;
    }
  }

  step() {
    this.recordTime();
    this.startTime();
  }

  stop() {
    this.recordTime();
    this._endTime = process.hrtime();
  }

  get total() {
    return this.times.reduce(function (total, time) {
      return total + time;
    }, 0);
  }
}

module.exports = Timer;