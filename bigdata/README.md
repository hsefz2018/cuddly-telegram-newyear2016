## 华师大二附中2015艺术节|元旦文艺汇演

# 弹幕·大数据

努力工作中 (;^_^A

## 程序使用方法

* 安装 [Node.js](https://nodejs.org/)
* `cd` 进入本文件所在的目录，运行
```bash
$ nodejs
> require('./analysis.js')
```
* 程序会输出10条数据用于检查。一个名为 `a` 的数组会被放到 `GLOBAL` 中。如果一切正常的话，可以开始分析了。
```javascript
> a.length
13830
> // 统计各个微信公众号发送的弹幕数
> a.reduce(function (r, e) { r[e.official_account]++; return r; }, [0, 0])
[ 12661, 1169 ]
```

祝大家玩得开心！审核菌们辛苦！（在晚会结尾发公告感谢的时候忘说了QAQ）~~CGT台长帅！高三&高四(?)巨神们帅！~~

挑灯夜（晨）战的周一楠巨神棒棒哒(๑•̀ㅂ•́)و✧ 其余参见回放结尾的底部弹幕！

最后……祝大家新年快乐！☆\*:.｡. o(≧▽≦)o .｡.:\*☆
