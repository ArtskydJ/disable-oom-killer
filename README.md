disable-oom-killer
==================

[![Build Status](https://travis-ci.org/ArtskydJ/disable-oom-killer.svg)](https://travis-ci.org/ArtskydJ/disable-oom-killer)

> Disable the OOM (Out Of Memory) Killer for a process (linux only)

# examples

```js
var disableOomKiller = require('disable-oom-killer')

disableOomKiller(function (err) {
	// swallow errors
})
```

```js
var cp = require('child_process')
var disableOomKiller = require('disable-oom-killer')

var lsr = cp.spawn('ls', [ '-R' ])

disableOomKiller(lsr)
```

# api

```js
var disableOomKiller = require('disable-oom-killer')
```

## `disableOomKiller([opts], [cb])`

- `opts` is an optional object:
	- `pid` is a string/number of the pid to kill. Defaults to `process.pid`. If the PID is not running, it will likely cause an error.
	- `oom_adj` is a string/number of the [oom_adj][oom]. Defaults to `-17`
	- `oom_score_adj` is a string/number of the [oom_score_adj][oom]. Defaults to `-1000`
- `cb(err)` is an optional callback function. Will call back with an error if on a non-linux system. If no callback is supplied, errors will be thrown.

## `disableOomKiller.sync([opts])`

Synchronous version of `disableOomKiller()`. Any errors that occur will be thrown.

- `opts` - Same as above.

# install

With [npm](http://nodejs.org/download) do:

	npm install disable-oom-killer

# license

[MIT](http://opensource.org/licenses/mit)


[oom]: http://www.psce.com/blog/kb/how-to-adjust-oom-score-for-a-process/
