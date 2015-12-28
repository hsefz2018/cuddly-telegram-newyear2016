(function (window) {
  var comment_type_names = {
    'top': window.commenting.type.TOP_SLIDE,
    'bottom': window.commenting.type.BOTTOM_STICK
  };

  var html_decode_helper = document.createElement('span');
  var html_decode = function (s) {
    html_decode_helper.innerHTML = s;
    return html_decode_helper.innerText;
  };

  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
  xhr.send();
  var socket = new WebSocket(xhr.response.substr(xhr.response.indexOf('ws://'), 115));
  socket.onmessage = function (msg) {
    var c = JSON.parse(msg.data);
    if (c.color == 'blue' || c.color == '#00f' || c.color == '#0000ff') c.color = '#66f';
    c.position = comment_type_names[c.position];
    c.message = html_decode(c.message);
    window.commenting.fire(c);
  };
  // window.commenting.fire({id: 1, message: 'xxx', position: 0, color: 'red'})
}(window));
