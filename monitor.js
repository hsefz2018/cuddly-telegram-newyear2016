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
  document.getElementById('comment-canvas').onmousedown = function (e) {
    commenting.remove_comment();
  };
}(window));
