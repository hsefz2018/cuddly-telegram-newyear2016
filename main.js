(function (window) {
  console.log('Hello from Cuddly Telegram');
  var window_w = window.innerWidth;
  var window_h = window.innerHeight;

  var html_decode_helper = document.createElement('span');
  var html_decode = function (s) {
    html_decode_helper.innerHTML = s;
    return html_decode_helper.innerText;
  };

  var comment_canvas = document.getElementById('comment-canvas');
  comment_canvas.width = window_w;
  comment_canvas.height = window_h;
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
    comment_draw_ctx.clearRect(0, 0, window_w, window_h);
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
  setInterval(comment_update_bullets, 25);
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
  var CommentBoardStick = function (width, height) {
    this.width = width;
    this.height = height;
    this.next_clear = [];
    for (var i = 0; i <= Math.ceil(height / comment_v_chunk_height); ++i) {
      this.next_clear[i] = 0;
    }
  };
  CommentBoardStick.prototype.fire = function (id, message, color) {
    var now = Date.now();
    // Measure size
    var cmt_w = comment_draw_ctx.measureText(message).width;
    var cmt_h = 64;
    // Animations
    var duration = Math.random() * 3000 + 5000;
    // Allocate space
    var positioning_data = null;
    var unblock_time = now + duration;
    var v_chunks = Math.ceil(cmt_h / comment_v_chunk_height);
    for (var i = 0; i <= this.next_clear.length - v_chunks; ++i) {
      if (this.next_clear[i] <= now) {
        var j, valid = true;
        for (j = i; j < i + v_chunks; ++j)
          if (this.next_clear[i] > now) {
            valid = false; break;
          }
        if (valid) {
          for (j = i; j < i + v_chunks; ++j) {
            this.next_clear[j] = unblock_time;
          }
          positioning_data = {line_num: i};
          break;
        } else {
          i = j;
        }
      }
    }
    if (positioning_data === null) return false;
    comment_add_bullet(id, message, color,
      this.y_for_line(positioning_data.line_num, cmt_h), (this.width - cmt_w) / 2, 0, duration);
    return true;
  };
  CommentBoardStick.prototype.y_for_line = function (num, cmt_h) { return 0; }; // Override me
  var CommentBoardTopStick = CommentBoardStick;
  CommentBoardTopStick.prototype.y_for_line = function (num, cmt_h) { return comment_v_chunk_height * num; };
  var CommentBoardBottomStick = CommentBoardStick;
  CommentBoardBottomStick.prototype.y_for_line = function (num, cmt_h) {
    return window_h - comment_v_chunk_height * num - cmt_h;
  };

  var comment_board_cnt = 4;
  var comment_board_topslide = [];
  var comment_board_bottomstick = [];
  for (var i = 0; i < comment_board_cnt; ++i) {
    comment_board_topslide[i] = new CommentBoardTopSlide(window_w, window_h);
  }
  var comment_board_fire = function (c) {
    if (c.color == 'blue' || c.color == '#00f' || c.color == '#0000ff') c.color = '#66f';
    var i;
    var board_array, board_type;
    // Decide type of the comment
    if (comment_type_names[c.position] === comment_types.TOP_SLIDE) {
      board_array = comment_board_topslide;
      board_type = CommentBoardTopSlide;
    } else if (comment_type_names[c.position] === comment_types.BOTTOM_STICK) {
      board_array = comment_board_bottomstick;
      board_type = CommentBoardBottomStick;
    }
    // Fire ☆*:.｡. o(≧▽≦)o .｡.:*☆
    c.message = html_decode(c.message);
    for (i = 0; i < board_array.length; ++i)
      if (board_array[i].fire(c.id, c.message, c.color)) break;
    if (i === board_array.length) {
      board_array.push(new board_type(window_w, window_h));
      board_array[board_array.length - 1].fire(c.id, c.message, c.color);
    }
  };

  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  // Workaround x2...
  // Workaround x3: http://stackoverflow.com/questions/17088609/disable-firefox-same-origin-policy/29096229#29096229
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
  xhr.send();
  var socket = new WebSocket(xhr.response.substr(xhr.response.indexOf('ws://'), 115));
  socket.onmessage = function (msg) {
    comment_board_fire(JSON.parse(msg.data));
    //var c = JSON.parse(msg.data);
    //comment_board_topslide[0].fire(c.id, c.message, c.color);
  };
  // window.f = comment_board_fire;
  // f({id: 233, message: 'xaxx', position: 'top', color: '#c0c0ff'})
}(window));
