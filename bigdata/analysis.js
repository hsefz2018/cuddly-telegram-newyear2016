var fs = require('fs');

var account_names = {'学生电视台': 0, '校友联络会': 1};
var result_names = {'由审核员批准': 0, '由审核员拒绝': 1, '系统自动批准': 2, '系统自动拒绝': 3};
var color_names = {'白色': 0, '红色': 1, '绿色': 2, '蓝色': 3};
var position_names = {'顶部': 0, '底部': 1};

// Date.parse() doesn't seem to work sometimes
// A simple date parser specifically optimized for such dates
// date_parse('2015-12-30 17:59:59') → -1
// date_parse('2015-12-30 18:01:01') → 61
var date_parse = function (d) {
  return ((d.charCodeAt(11) - 48) * 10 + d.charCodeAt(12) - 48) * 3600 +
    ((d.charCodeAt(14) - 48) * 10 + d.charCodeAt(15) - 48) * 60 +
    ((d.charCodeAt(17) - 48) * 10 + d.charCodeAt(18) - 48) - 64800;
};

var json_file = '2016newyeardanmaku.json';
var a = JSON.parse(fs.readFileSync(json_file, { encoding: 'utf-8' }));

console.log(a.slice(0, 10));
