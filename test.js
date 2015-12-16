var test = require('tape')
var fs = require('fs')
var spawn = require('child_process').spawn
var disableOomKiller = require('./index.js')

function expect(t, pid, oom_adj, oom_score_adj) {
	try {
		t.equal(fs.readFileSync('/proc/' + pid + '/oom_adj', 'utf8'), oom_adj)
	} catch (err) {
		t.ifError(err)
	}
	
	try {
		t.equal(fs.readFileSync('/proc/' + pid + '/oom_score_adj', 'utf8'), oom_score_adj)
	} catch (err) {
		t.ifError(err)
	}

	t.end()
}

if (process.platform === 'linux') {
	test('async defaults', function (t) {
		disableOomKiller(function (err) {
			t.ifError(err)
			expect(t, process.pid, '-17\n', '-1000\n')
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
			expect(t, proc.pid, '-16\n', '-999\n')
		})
	})

	test('sync defaults', function (t) {
		t.doesNotThrow(disableOomKiller.sync)
		expect(t, process.pid, '-17\n', '-1000\n')
	})

	test('sync options', function (t) {
		var proc = spawn('ls', [ '-1' ])
		t.doesNotThrow(function () {
			disableOomKiller.sync({
				pid: proc.pid,
				oom_adj: 0,
				oom_score_adj: 0
			})
		})
		expect(t, proc.pid, '0\n', '0\n')
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
