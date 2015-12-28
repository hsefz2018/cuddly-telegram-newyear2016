# cuddly-telegram-newyear2016

HSEFZ 2016元旦文艺汇演弹幕屏（替补 = =）

在 Firefox 下工作正常，调试用全局 CORS 插件：[cors everywhere](https://addons.mozilla.org/zh-CN/firefox/addon/cors-everywhere/)  
其他浏览器暂未测试

↓ Unicode 字符测试 √

![Screenshot](screenshot.png)

弹幕后台 `sender.html`
=====================

Firefox / Chrome / Safari 均工作正常，但同样存在同源策略问题……

已经更新以符合当前服务器 API（2015/12/28 23:00 GMT +8）

TODO
====

* 测试文字阴影与导播机/大屏幕的综合效果并进行调整（于 2015/12/29 下午进行）
* ~~使用浅一点的蓝色（`#00f` 在大屏幕上效果不佳）~~
