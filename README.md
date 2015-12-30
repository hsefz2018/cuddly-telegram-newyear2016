# cuddly-telegram-newyear2016

HSEFZ 2016元旦文艺汇演弹幕屏

由于服务端未设置 `Access-Control-Allow-Origin` 的 HTTP 头，调试/运行时需要使用插件暂时绕过浏览器的同源策略  
Firefox 插件：[cors everywhere](https://addons.mozilla.org/zh-CN/firefox/addon/cors-everywhere/)  
Chrome 插件：[Access-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

↓ Unicode 字符测试 √

![Screenshot](screenshot.png)

弹幕后台 `sender.html`
=====================

Firefox / Chrome / Safari 均工作正常，但同样存在同源策略问题……

已经更新以符合当前服务器 API（2015/12/28 23:00 GMT +8）

审核程序 `monitor.html`（只是一个不能用的原型）
=======================

点击一条弹幕进行删除，按下空格键可以暂停，其余同上…………

TODO
====

* ~~测试文字阴影与导播机/大屏幕的综合效果并进行调整（于 2015/12/29 下午进行）~~（完成，效果拔群）
* ~~使用浅一点的蓝色（`#00f` 在大屏幕上效果不佳）~~
