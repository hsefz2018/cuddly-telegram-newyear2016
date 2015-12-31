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
  [ 27, 54, '开场视频&倒计时'],
  [ 33, 15, '主持人报幕'],
//[ 36, 34, '幕间词1：梦'],
  [ 39, 20, '高二(4) 创意打击乐演奏 Click Click'], // 时间是估计的，回看 38:35~39:35 一段似乎在上传时遗失
  [ 43,  7, '高二(8) 舞蹈 Smooth Criminal'],
  [ 48, 20, '紫竹校区 歌曲演唱 梦回西厢'],
  [ 57,  9, '高一(2) 现代舞 玉生烟'],
  [ 62, 53, '抽奖环节一'],
  [ 65, 19, '魔术社 纸牌幻觉'],
  [ 73, 58, '范永武、森利一郎、中濑古宽斗、程震霄 武术'],
  [ 79, 21, '教师：刘睛敏、傅振良 歌曲演唱 十年'],
  [ 82, 54, '校友新年祝福视频一'],
  [ 99, 14, '张江Vortex学生乐队 歌曲 真的爱你'],
  [106, 10, '好像有什么不科学'],
];
replay_offset = 2134
programmes = programmes.map(function (e) { return { start: e[0] * 60 + e[1] - replay_offset, name: e[2] }; })
