// 整体：来源（微信公众号），颜色，位置，审核通过率
a.reduce(function (r, e) { r[e.official_account]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.color]++; return r; }, [0, 0, 0, 0])
a.reduce(function (r, e) { r[e.position]++; return r; }, [0, 0])
a.reduce(function (r, e) { r[e.check_result]++; return r; }, [0, 0, 0, 0, 0, 0])
