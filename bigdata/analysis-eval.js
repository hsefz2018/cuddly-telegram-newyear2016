require('./analysis.js')

// 整体：来源（微信公众号），颜色，位置，审核通过率，用户
a.reduce(function (r, e) { r[e.official_account]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.color]++; return r; }, [0, 0, 0, 0])
a.reduce(function (r, e) { r[e.position]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.check_result]++; return r; }, [0, 0, 0, 0, 0, 0])

// 用户发送弹幕数
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
