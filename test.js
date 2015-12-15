var test = require('tape')
var fs = require('fs')
var spawn = require('child_process').spawn
var disableOomKiller = require('./index.js')

if (process.platform === 'linux') {
	test('async defaults', function (t) {
		disableOomKiller(function (err) {
			t.ifError(err)

			t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_adj', 'utf8'), '-17\n')
			t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_score_adj', 'utf8'), '-1000\n')

			t.end()
		})
	})

	test('async options', function (t) {
		var proc = spawn('ls', [ '-R' ])
		disableOomKiller({
			pid: proc.pid,
			oom_adj: -16,
			oom_score_adj: -999
		}, function (err) {
			t.ifError(err)

			t.equal(fs.readFileSync('/proc/' + proc.pid + '/oom_adj', 'utf8'), '-16\n')
			t.equal(fs.readFileSync('/proc/' + proc.pid + '/oom_score_adj', 'utf8'), '-999\n')

			t.end()
		})
	})

	test('sync defaults', function (t) {
		t.doesNotThrow(disableOomKiller.sync)

		t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_adj', 'utf8'), '-17\n')
		t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_score_adj', 'utf8'), '-1000\n')

		t.end()
	})

	test('sync options', function (t) {
		var proc = spawn('ls', [ '-1' ])
		disableOomKiller.sync({
			pid: proc.pid,
			oom_adj: 0,
			oom_score_adj: 0
		})

		t.equal(fs.readFileSync('/proc/' + proc.pid + '/oom_adj', 'utf8'), '0\n')
		t.equal(fs.readFileSync('/proc/' + proc.pid + '/oom_score_adj', 'utf8'), '0\n')

		t.end()
	})
	
	test('child_process object as options', function (t) {
		disableOomKiller(spawn('ls', [ '-SR' ]), function (err) {
			t.ifError(err)
			t.end()
		})
	})
} else {
	test('non-linux', function (t) {
		console.log(process.platform)
		t.throws(disableOomKiller.sync, /Unsupported on non-linux systems/)
		
		disableOomKiller(function (err) {
			t.equal(err.message, 'Unsupported on non-linux systems')
			t.end()
		})
	})
}
