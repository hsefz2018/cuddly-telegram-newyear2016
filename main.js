(function (window) {
  var comment_type_names = {
    'top': window.commenting.type.TOP_SLIDE,
    'bottom': window.commenting.type.BOTTOM_STICK,
    'top-stick': window.commenting.type.TOP_STICK
  };

  var html_decode_helper = document.createElement('span');
  var html_decode = function (s) {
    html_decode_helper.innerHTML = s;
    return html_decode_helper.innerText;
  };

  document.onkeydown = function (e) {
    if (e.keyCode == 32) window.commenting.toggle_pause();
  };

  commenting.font = '48px Lucida Grande';
  commenting.text_height = 54;
  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  window.last_text = '';
  var reconnect = function () {
    if (window.c_socket) window.c_socket.close();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
    xhr.send();
    var socket = new WebSocket(xhr.response.substr(xhr.response.indexOf('ws://'), 115));
    window.last_received_id = -1;
    socket.onmessage = function (msg) {
      var c = JSON.parse(msg.data);
      if (c.color == 'blue' || c.color == '#00f' || c.color == '#0000ff') c.color = '#66f';
      c.position = comment_type_names[c.position];
      c.message = html_decode(c.message);
      if (c.message == window.last_text) return;
      window.last_text = c.message;
      if (c.message.substr(0, 8) === '#opacity') {
        document.getElementById('comment-canvas').style.opacity = c.message.substr(8); 
      } else {
        window.commenting.fire(c);
      }
      //setTimeout((function (_c) { return function () { window.commenting.fire(_c); }; })(c), 15000);
    };
    socket.onclose = reconnect;
    // window.commenting.fire({id: 1, message: 'xxx', position: 0, color: 'red'})
  };
  reconnect();
}(window));
