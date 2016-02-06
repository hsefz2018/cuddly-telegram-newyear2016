var account_names = {'学生电视台': 0, '校友联络会': 1};
var result_names = {'由审核员批准': 0, '由审核员拒绝': 1, '系统自动批准': 2, '系统自动拒绝': 3, '人工审核中': 4, '未审核': 5};
var color_names = {'白色': 0, '红色': 1, '绿色': 2, '蓝色': 3};
var position_names = {'顶部': 0, '底部': 1};

// Date.parse() doesn't seem to work sometimes
// A simple date parser specifically optimized for such dates
// date_parse('2015-12-30 17:59:59') → -1
// date_parse('2015-12-30 18:01:01') → 61
var date_parse = function (d) {
  if (!d) return -1;
  return ((d.charCodeAt(11) - 48) * 10 + d.charCodeAt(12) - 48) * 3600 +
    ((d.charCodeAt(14) - 48) * 10 + d.charCodeAt(15) - 48) * 60 +
    ((d.charCodeAt(17) - 48) * 10 + d.charCodeAt(18) - 48) - 64800;
};

var a = require('./2016newyeardanmaku.json');

// XXX: a = a.map(function (e) { ... }) ?
for (var i = 0; i < a.length; ++i) {
  a[i].official_account = account_names[a[i].official_account];
  a[i].color = color_names[a[i].color];
  a[i].position = position_names[a[i].position];
  a[i].check_result = result_names[a[i].check_result];
  a[i].send_time = date_parse(a[i].send_time);
  a[i].assign_time = date_parse(a[i].assign_time);
  a[i].check_time = date_parse(a[i].check_time);
  a[i].message = a[i].message.toString(); // Pure-numeric messages ˊ_>ˋ
}

console.log(a.slice(657, 666));
GLOBAL.a = a;
