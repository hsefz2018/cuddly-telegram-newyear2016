(function (window) {
  console.log('Hello from Cuddly Telegram');

  var comment_types = { TOP_SLIDE: 0, TOP_STICK: 1, BOTTOM_STICK: 2 };
  var comment_type_names = { 'top': 0, 'bottom': 2 }; // Workaround = =
  var comment_board_fire = function (c) {
    var s = 'ID: ' + c.id + ', MSG: ' + c.message + ', TYPE: ' + comment_type_names[c.position] + ', COLOR: ' + c.color;
    var bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = '0px';
    bullet.style.top = Math.floor(Math.random() * 300) + 'px';
    bullet.innerHTML = s;
    document.body.appendChild(bullet);
  };

  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  // Workaround x2...
  // Workaround x3: http://stackoverflow.com/questions/17088609/disable-firefox-same-origin-policy/29096229#29096229
  /*var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
  xhr.send();
  var socket = new WebSocket(xhr.response.substr(4299, 115));
  socket.onmessage = function (msg) {
    comment_board_fire(JSON.parse(msg.data));
  };
  window.___socket = socket;*/
  window.f = comment_board_fire;
}(window));
