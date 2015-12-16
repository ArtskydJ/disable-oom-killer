var after  = require('after')
var fs = require('fs')
var xtend  = require('xtend')

function parseOpts(options) {
	var o = xtend({
		pid: process.pid,
		oom_score_adj: '-1000',
		oom_adj: '-17'
	}, options)
	console.log(o.oom_adj, o.oom_score_adj)
	return o
}

module.exports = function disableOomKiller(options, cb) {
	if (typeof options !== 'object') {
		cb = options
		options = {}
	}
	if (typeof cb !== 'function') cb = function (err) { if (err) throw err }
	var next = after(2, cb)

	if (process.platform === 'linux') {
		var opts = parseOpts(options)
		fs.writeFile('/proc/' + opts.pid + '/oom_adj', opts.oom_adj.toString(), next)
		fs.writeFile('/proc/' + opts.pid + '/oom_score_adj', opts.oom_score_adj.toString(), next)
	} else {
		process.nextTick(function () {
			cb(new Error('Unsupported on non-linux systems'))
		})
	}
}

module.exports.sync = function disableOomKillerSync(options) {
	if (process.platform === 'linux') {
		var opts = parseOpts(options)
		fs.writeFileSync('/proc/' + opts.pid + '/oom_adj', opts.oom_adj.toString())
		fs.writeFileSync('/proc/' + opts.pid + '/oom_score_adj', opts.oom_score_adj.toString())
	} else {
		throw new Error('Unsupported on non-linux systems')
	}
}

// http://lwn.net/Articles/317814/
// http://backdrift.org/oom-killer-how-to-create-oom-exclusions-in-linux
// http://www.oracle.com/technetwork/articles/servers-storage-dev/oom-killer-1911807.html
