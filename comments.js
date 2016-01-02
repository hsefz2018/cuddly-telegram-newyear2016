(function (window) {
  console.log('Hello from Cuddly Telegram');
  var commenting = { font: '54px Lucida Grande', text_height: 64, expiry_callback: undefined };
  var window_w = window.innerWidth;
  var window_h = window.innerHeight;
  var padding_top = 20;
  var padding_bottom = 30;
  var height_limit = window_h;

  var comment_canvas = document.getElementById('comment-canvas');
  comment_canvas.width = window_w;
  comment_canvas.height = window_h;
  var comment_draw_ctx = comment_canvas.getContext('2d');

  var comment_types = { TOP_SLIDE: 0, TOP_STICK: 1, BOTTOM_STICK: 2 };

  var comment_onboard_bullets = [];
  var comment_add_bullet = function (id, message, color, top, left, width, height, xspeed, life) {
    var i;
    for (i = 0; comment_onboard_bullets[i]; ++i);
    comment_onboard_bullets[i] = {
      id: id, message: message, color: color,
      y: top, x: left, w: width, h: height, xspeed: xspeed,
      life: life
    };
  };
  var comment_update_last_time = -1;
  var comment_is_paused = false;
  var comment_highlighted_idx = -1;
  var comment_update_bullets = function () {
    var now = Date.now();
    var delta = now - comment_update_last_time;
    comment_draw_ctx.clearRect(0, 0, window_w, window_h);
    comment_draw_ctx.font = commenting.font;
    comment_draw_ctx.textBaseline = 'top';
    comment_draw_ctx.shadowColor = '#666666';
    comment_draw_ctx.shadowBlur = 0;  // 6;
    comment_draw_ctx.shadowOffsetX = 2;
    comment_draw_ctx.shadowOffsetY = 2;
    var cur_bullet;
    for (var i = 0; i < comment_onboard_bullets.length; ++i) {
      cur_bullet = comment_onboard_bullets[i];
      if (!cur_bullet) continue;
      if (!comment_is_paused) {
        cur_bullet.x += cur_bullet.xspeed * delta;
        if ((cur_bullet.life -= delta) <= 0) {
          if (commenting.expiry_callback) commenting.expiry_callback(cur_bullet);
          comment_onboard_bullets[i] = undefined;
          continue;
        }
      }
      // Draw the bullet
      comment_draw_ctx.fillStyle = cur_bullet.color;
      comment_draw_ctx.fillText(cur_bullet.message, cur_bullet.x, cur_bullet.y);
      // Highlight if set
      if (i === comment_highlighted_idx) {
        comment_draw_ctx.strokeStyle = 'white';
        comment_draw_ctx.strokeRect(cur_bullet.x, cur_bullet.y, cur_bullet.w, cur_bullet.h);
      }
    }
    comment_update_last_time = now;
  };
  setInterval(comment_update_bullets, 25);
  comment_update_last_time = Date.now();

  // For selecting comments with mouse
  commenting.comment_at_pos = function (x, y) {
    var i, cur_bullet;
    for (i = 0; i < comment_onboard_bullets.length; ++i) {
      if ((cur_bullet = comment_onboard_bullets[i])
        && cur_bullet.x <= x && cur_bullet.x + cur_bullet.w >= x
        && cur_bullet.y <= y && cur_bullet.y + cur_bullet.h >= y) return i;
    }
    return -1;
  };
  commenting.highlight_comment = function (idx_or_x, y) {
    if (y != null) comment_highlighted_idx = commenting.comment_at_pos(idx_or_x, y);
    else comment_highlighted_idx = idx_or_x;
  };
  // Removes highlighted comment or comment with given index
  commenting.remove_comment = function (idx) {
    if (idx == null) { idx = comment_highlighted_idx; comment_highlighted_idx = -1; }
    if (idx >= 0 && idx < comment_onboard_bullets.length)
      comment_onboard_bullets[idx] = undefined;
  };

  var comment_v_chunk_height = 5;
  var CommentBoardTopSlide = function (width, height) {
    this.width = width;
    this.height = height;
    this.next_unblock = [];
    this.next_clear = [];
    for (var i = 0; i <= Math.ceil(height_limit / comment_v_chunk_height); ++i) {
      this.next_unblock[i] = 0;
      this.next_clear[i] = 0;
    }
  };
  CommentBoardTopSlide.prototype.fire = function (id, message, color) {
    var now = Date.now();
    // Measure size
    var cmt_w = comment_draw_ctx.measureText(message).width;
    var cmt_h = commenting.text_height;
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
          positioning_data = {top: comment_v_chunk_height * i + padding_top, speed: speed};
          break;
        } else {
          i = j;
        }
      }
    }
    if (positioning_data === null) return false;
    comment_add_bullet(id, message, color, positioning_data.top, this.width, cmt_w, cmt_h, -speed, duration);
    return true;
  };
  var comment_board_stick_ctor = function () { return function (width, height) {
    this.width = width;
    this.height = height;
    this.next_clear = [];
    for (var i = 0; i <= Math.ceil(height_limit / comment_v_chunk_height); ++i) {
      this.next_clear[i] = 0;
    }
  }; };
  var CommentBoardStick = comment_board_stick_ctor();
  CommentBoardStick.prototype.fire = function (id, message, color) {
    var now = Date.now();
    // Measure size
    var cmt_w = comment_draw_ctx.measureText(message).width;
    var cmt_h = commenting.text_height;
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
      this.y_for_line(positioning_data.line_num, cmt_h), (this.width - cmt_w) / 2, cmt_w, cmt_h, 0, duration);
    return true;
  };
  CommentBoardStick.prototype.y_for_line = function (num, cmt_h) { return 0; }; // Override me
  var CommentBoardTopStick = comment_board_stick_ctor();
  CommentBoardTopStick.prototype = new CommentBoardStick();
  CommentBoardTopStick.prototype.y_for_line = function (num, cmt_h) {
    return comment_v_chunk_height * num + padding_top;
  };
  var CommentBoardBottomStick = comment_board_stick_ctor();
  CommentBoardBottomStick.prototype = new CommentBoardStick();
  CommentBoardBottomStick.prototype.y_for_line = function (num, cmt_h) {
    return window_h - comment_v_chunk_height * num - cmt_h - padding_bottom;
  };

  var comment_board_topslide = [];
  var comment_board_topstick = [];
  var comment_board_bottomstick = [];
  commenting.fire = function (c) {
    var i;
    var board_array, board_type;
    // Decide type of the comment
    if (c.position === comment_types.TOP_SLIDE) {
      board_array = comment_board_topslide;
      board_type = CommentBoardTopSlide;
    } else if (c.position === comment_types.TOP_STICK) {
      board_array = comment_board_topstick;
      board_type = CommentBoardTopStick;
    } else if (c.position === comment_types.BOTTOM_STICK) {
      board_array = comment_board_bottomstick;
      board_type = CommentBoardBottomStick;
    }
    // Fire ☆*:.｡. o(≧▽≦)o .｡.:*☆
    for (i = 0; i < board_array.length; ++i)
      if (board_array[i].fire(c.id, c.message, c.color)) break;
    if (i === board_array.length) {
      board_array.push(new board_type(window_w, window_h));
      board_array[board_array.length - 1].fire(c.id, c.message, c.color);
    }
  };
  commenting.pause = function () {
    comment_is_paused = true;
  };
  commenting.resume = function () {
    comment_is_paused = false;
  };
  commenting.toggle_pause = function () {
    comment_is_paused = !comment_is_paused;
  };

  window.commenting = commenting;
  window.commenting.type = comment_types;
}(window));
