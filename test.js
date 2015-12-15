var test = require('tape')
var fs = require('fs')
var disableOomKiller = require('./index.js')

if (process.platform === 'linux') {
	test('async defaults', function (t) {
		disableOomKiller(function (err) {
			t.ifError(err)

			t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_adj', 'utf8'), '-17')
			t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_score_adj', 'utf8'), '-1000')

			t.end()
		})
	})

	test('async options', function (t) {
		disableOomKiller({
			pid: 0,
			oom_adj: -16,
			oom_score_adj: -999
		}, function (err) {
			t.ifError(err)

			t.equal(fs.readFileSync('/proc/0/oom_adj', 'utf8'), '-16')
			t.equal(fs.readFileSync('/proc/0/oom_score_adj', 'utf8'), '-999')

			t.end()
		})
	})

	test('sync defaults', function (t) {
		t.doesNotThrow(disableOomKiller.sync)

		t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_adj', 'utf8'), '-17')
		t.equal(fs.readFileSync('/proc/' + process.pid + '/oom_score_adj', 'utf8'), '-1000')

		t.end()
	})

	test('sync options', function (t) {
		disableOomKiller.sync({
			pid: 1,
			oom_adj: -15,
			oom_score_adj: -998
		})

		t.equal(fs.readFileSync('/proc/1/oom_adj', 'utf8'), '-15')
		t.equal(fs.readFileSync('/proc/1/oom_score_adj', 'utf8'), '-998')

		t.end()
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
