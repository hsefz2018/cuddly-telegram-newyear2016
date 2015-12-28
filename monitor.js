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

  document.onkeydown = function (e) {
    if (e.keyCode == 32) window.commenting.toggle_pause();
  };

  document.getElementById('comment-canvas').onmousemove = function (e) {
    // console.log(e.clientX + ' ' + e.clientY);
    commenting.highlight_comment(e.clientX, e.clientY);
  };
  document.getElementById('comment-canvas').onmouseup = function (e) {
    commenting.remove_comment();
  };
  var random_colour = function () {
    var colour_code = Math.floor(Math.random() * 256 * 256 * 256);
    var s = colour_code.toString(16);
    while (s.length < 6) s = '0' + s;
    return '#' + s;
  };
  setInterval(function () {
    window.commenting.fire({id: Math.floor(Math.random() * 0xffffff), message: 'xxxxxx', position: 0, color: random_colour()})
  }, 300);
}(window));
