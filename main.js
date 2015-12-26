(function (window) {
  console.log('Hello from Cuddly Telegram');

  var comment_canvas = document.getElementById('comment-canvas');
  comment_canvas.width = document.documentElement.clientWidth;
  comment_canvas.height = document.documentElement.clientHeight;
  var comment_draw_ctx = comment_canvas.getContext('2d');

  var comment_types = { TOP_SLIDE: 0, TOP_STICK: 1, BOTTOM_STICK: 2 };
  var comment_type_names = { 'top': 0, 'bottom': 2 }; // Workaround = =

  var comment_onboard_bullets = [];
  var comment_add_bullet = function (id, message, color, top, left, xspeed, life) {
    var i;
    for (i = 0; comment_onboard_bullets[i]; ++i);
    comment_onboard_bullets[i] = {
      id: id, message: message, color: color,
      y: top, x: left, xspeed: xspeed,
      expiry: Date.now() + life
    };
  };
  var comment_update_last_time = -1;
  var comment_update_bullets = function () {
    var now = Date.now();
    var delta = now - comment_update_last_time;
    comment_draw_ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
    comment_draw_ctx.font = '54px Lucida Grande';
    comment_draw_ctx.textBaseline = 'top';
    comment_draw_ctx.shadowColor = '#666666';
    comment_draw_ctx.shadowBlur = 0;  // 6;
    comment_draw_ctx.shadowOffsetX = 2;
    comment_draw_ctx.shadowOffsetY = 2;
    var cur_bullet;
    for (var i = 0; i < comment_onboard_bullets.length; ++i) {
      cur_bullet = comment_onboard_bullets[i];
      if (!cur_bullet) continue;
      cur_bullet.x += cur_bullet.xspeed * delta;
      if (now > cur_bullet.expiry) comment_onboard_bullets[i] = undefined;
      else {
        // Draw the bullet
        comment_draw_ctx.fillStyle = cur_bullet.color;
        comment_draw_ctx.fillText(cur_bullet.message, cur_bullet.x, cur_bullet.y);
      }
    }
    comment_update_last_time = now;
  };
  setInterval(comment_update_bullets, 40);
  comment_update_last_time = Date.now();

  var comment_v_chunk_height = 5;
  var CommentBoardTopSlide = function (width, height) {
    this.width = width;
    this.height = height;
    this.next_unblock = [];
    this.next_clear = [];
    for (var i = 0; i <= Math.ceil(height / comment_v_chunk_height); ++i) {
      this.next_unblock[i] = 0;
      this.next_clear[i] = 0;
    }
  };
  CommentBoardTopSlide.prototype.fire = function (id, message, color) {
    var now = Date.now();
    // Measure size
    var cmt_w = comment_draw_ctx.measureText(message).width;
    var cmt_h = 64;
    // Animations
    var duration = Math.random() * 3000 + 8000;
    var speed = (this.width + cmt_w) / duration;
    // Allocate space
    var positioning_data = null;
    var unblock_time = now + cmt_w / speed;
    var border_touch_time = now + this.width / speed;
    var fully_out_time = now + duration;
    var v_chunks = Math.ceil(cmt_h / comment_v_chunk_height);
    for (var i = 0; i <= this.next_unblock.length - v_chunks; ++i) {
      if (this.next_unblock[i] <= now && this.next_clear[i] <= border_touch_time) {
        var j, valid = true;
        for (j = i; j < i + v_chunks; ++j)
          if (this.next_unblock[i] > now || this.next_clear[i] > border_touch_time) {
            valid = false; break;
          }
        if (valid) {
          for (j = i; j < i + v_chunks; ++j) {
            this.next_unblock[j] = unblock_time;
            this.next_clear[j] = fully_out_time;
          }
          positioning_data = {top: comment_v_chunk_height * i, speed: speed};
          break;
        } else {
          i = j;
        }
      }
    }
    if (positioning_data === null) return false;
    comment_add_bullet(id, message, color, positioning_data.top, this.width, -speed, duration);
    return true;
  };

  var comment_board_cnt = 4;
  var comment_board_topslide = [];
  for (var i = 0; i < comment_board_cnt; ++i) {
    comment_board_topslide[i] = new CommentBoardTopSlide(document.documentElement.clientWidth, document.documentElement.clientHeight);
  }
  var comment_board_fire = function (c) {
    var i;
    if (comment_type_names[c.position] === comment_types.TOP_SLIDE) {
      for (i = 0; i < comment_board_topslide.length; ++i)
        if (comment_board_topslide[i].fire(c.id, c.message, c.color)) break;
      if (i === comment_board_topslide.length) {
        comment_board_topslide.push(new CommentBoardTopSlide(document.documentElement.clientWidth, document.documentElement.clientHeight));
        comment_board_topslide[comment_board_topslide.length - 1].fire(c.id, c.message, c.color);
      }
    }
  };

  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  // Workaround x2...
  // Workaround x3: http://stackoverflow.com/questions/17088609/disable-firefox-same-origin-policy/29096229#29096229
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
  xhr.send();
  var socket = new WebSocket(xhr.response.substr(4299, 115));
  socket.onmessage = function (msg) {
    comment_board_fire(JSON.parse(msg.data));
    //var c = JSON.parse(msg.data);
    //comment_board_topslide[0].fire(c.id, c.message, c.color);
  };
  window.___socket = socket;
  window.f = comment_board_fire;
  // f({id: 233, message: 'xaxx', type: 'top', color: '#c0c0ff'})
}(window));
