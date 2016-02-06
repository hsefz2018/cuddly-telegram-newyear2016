require('./analysis.js')

// 整体：来源（微信公众号），颜色，位置，审核通过率，用户
a.reduce(function (r, e) { r[e.official_account]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.color]++; return r; }, [0, 0, 0, 0])
a.reduce(function (r, e) { r[e.position]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.check_result]++; return r; }, [0, 0, 0, 0, 0, 0])

// 用户发送弹幕数
// user_num: 用户ID作为关键字，次数作为值
// num_user: 次数作为关键字，用户ID作为值
function count_user(user_num, require_ids /* = false */) {
  var num_user = {};
  for (var k in user_num) { var v = user_num[k]; if (num_user[v]) num_user[v].push(k); else num_user[v] = [k]; }
  if (require_ids) return num_user;
  for (var k in num_user) num_user[k] = num_user[k].length;
  return num_user;
};
count_user(a.reduce(function (r, e) { r[e.user_identifier] = (r[e.user_identifier] + 1) || 1; return r; }, {}))

// 用户被通过/拒绝的弹幕数
// 可用 Array.prototype.filter 代替
count_user(a.reduce(function (r, e) { if (e.check_result === 0 || e.check_result === 2) r[e.user_identifier] = (r[e.user_identifier] + 1) || 1; return r; }, {}))
count_user(a.reduce(function (r, e) { if (e.check_result === 1 || e.check_result === 3) r[e.user_identifier] = (r[e.user_identifier] + 1) || 1; return r; }, {}))

// 分时段统计弹幕数量
// 时间粒度：30秒
time_seg = 30
a.reduce(function (r, e) { var m = Math.floor(e.send_time / time_seg); r[m] = r[m] ? (r[m] + 1) : 1; return r; }, {})
a.reduce(function (r, e) { var m = Math.floor(e.assign_time / time_seg); r[m] = r[m] ? (r[m] + 1) : 1; return r; }, {})
a.reduce(function (r, e) { var m = Math.floor(e.check_time / time_seg); r[m] = r[m] ? (r[m] + 1) : 1; return r; }, {})
// 分节目统计弹幕数量
// 不管了我就按照532号弹幕上屏的时间＝审核通过的时间算好了。。
// 2009=33:29=17:57:55=-125（哎反正泥萌看得懂就行）所以真实时间＝播放器时间-2134 嗯就是酱紫~
programmes = [
  [ 20, 44, '开场舞1'],
  [ 25, 33, '开场舞2'],
  [ 27, 54, '* 开场视频&倒计时'],
  [ 33, 15, '* 主持人报幕'],
//[ 36, 34, '幕间词1：梦'],
  [ 39, 20, '高二(4) 创意打击乐演奏 Click Click'], // 时间是估计的，回看 38:35~39:35 一段似乎在上传时遗失
  [ 43,  7, '高二(8) 舞蹈 Smooth Criminal'],
  [ 48, 20, '紫竹校区 歌曲 梦回西厢'],
  [ 57,  9, '高一(2) 现代舞 玉生烟'],
  [ 62, 53, '* 抽奖环节一'],
  [ 65, 19, '魔术社 纸牌幻觉'],
  [ 73, 58, '范永武、森利一郎、中濑古宽斗、程震霄 武术'],
  [ 79, 21, '教师：刘睛敏、傅振良 歌曲 十年'],
  [ 82, 54, '* 校友新年祝福视频一'],
  [ 99, 14, '张江Vortex学生乐队 歌曲 真的爱你'],
  [106, 10, '好像有什么不科学'],
  [109, 53, "高二境外 舞蹈 Darling! I'm a good boy"],
  [115, 53, '高二(3) 小品 全民男神'],
  [127, 24, '* 抽奖环节二 & 校园文化艺术节专场颁奖'],
  [130, 24, '刘海正、吴旻玥 歌曲 A Moment Like This'], // 原文是 The Moment Like This 不过窝怀疑是写错了？？
  [135, 41, '高二(1) 动作小品 疯狂的乒乓球'],
  [142, 14, '教师：刘希蕾、严婕、杨一菲、马晓磊、李卓辰 舞蹈 Barbarbar'],
  [145, 27, '* 校友新年祝福视频二'],
  [160, 50, '紫竹校区Still乐队 歌曲 T1213121+Whatya want from me'],
  [168, 21, '高一(10) 相声 我与巨神'],
  [175, 46, '高一(2) 舞蹈 菁菁校园'],
  [179, 33, '晨晖爱乐 管弦乐演奏 Victory'],
  [184, 23, '* 抽奖环节三 & 校长新年致辞'],
  [188, 49, '* 校友新年祝福视频三'],
  [191, 47, '紫竹话剧社 舞台剧 解救何小天'],
  [206, 13, '* 校友新年祝福视频四（SJTU）'],
  [212, 42, '街舞社 舞蹈 Bang Bang Bang'],
  [217, 45, '高三全体 合唱 爱因为在心中'],
  [223, 36, '高一(6) 歌曲 & 团学联集体谢幕舞蹈 High School Musical'],
  [229, 53, '* 谢幕后']
];
replay_offset = 2134
programmes = programmes.map(function (e) { return { start: e[0] * 60 + e[1] - replay_offset, name: e[2] }; })

prog_cnt = a.reduce(function (r, e) { var m = 0; while (m < programmes.length && programmes[m].start < e.send_time) ++m; --m; if (m >= 0) r[m] = r[m] ? (r[m] + 1) : 1; return r; }, {})
prog_cnt_by_name = {}
for (var i in prog_cnt) prog_cnt_by_name[programmes[i].name] = prog_cnt[i];
prog_cnt_by_name
for (var i in prog_cnt) { i = parseInt(i); prog_cnt_by_name[programmes[i].name] /= ((programmes[i + 1] ? programmes[i + 1].start : (14081 - replay_offset)) - programmes[i].start); }
prog_cnt_by_name  // 弹幕密度
count_user(prog_cnt_by_name, true)

// 弹幕总字数（包括标点符号、空格）
//for (var i = 0; i < a.length; ++i) if (a[i].message.length == undefined) console.log(a[i]);
a.reduce(function (r, e) { return r + e.message.length; }, 0)
// 统计单字
single_char = {};
var str = '', cur;
for (var i = 0; i < a.length; ++i) {
  str = a[i].message;
  for (var j = 0; j < str.length; ++j) {
    cur = str[j];
    single_char[cur] = single_char[cur] ? (single_char[cur] + 1) : 1;
  }
}
single_char = count_user(single_char, true)
for (var i in single_char) single_char[i] = single_char[i].join('');
single_char

// 双音节词
function count_words(len, fun, cutoff) {
  var ret = {}, str = '', cur;
  for (var i = 0; i < a.length; ++i) if (fun(a[i])) {
    str = a[i].message.toUpperCase();
    for (var j = 0; j < str.length - len + 1; ++j) {
      cur = str.substr(j, len);
      ret[cur] = ret[cur] ? (ret[cur] + 1) : 1;
    }
  }
  ret = count_user(ret, true);
  if (cutoff) {
    for (var i = 0; i < cutoff; ++i) delete ret[i];
  }
  for (var i in ret) ret[i] = ret[i].join(' ');
  return ret;
}
count_words(3, function (e) { return e.check_result === 0 || e.check_result === 2; }, 15)
count_words(3, function (e) { return e.check_result === 1 || e.check_result === 3; }, 15)
