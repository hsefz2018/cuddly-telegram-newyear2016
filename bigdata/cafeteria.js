var btngroup_click_handler = function (e) {
  var bro = e.target.parentElement.children;
  for (var i = 0; i < bro.length; ++i) bro[i].classList.remove('active');
  e.target.classList.add('active');
};
var btngroup_click = function (f) {
  return function (e) { f(); btngroup_click_handler(e); };
};
var options = {
  bucket_size: 30,
  disp_mode: 0,
  comment: {  }
};
var count_with_options = function () {
  count_bargraph(function (d) {
    var b1 = d.message.includes('东山'), b2 = d.message.includes('蔡');
    if (b1) return b2 ? 1 : 2;
    else return b2 ? 3 : 4;
  }, ['#2222aa', '#8888ff', '#66ccff', '#aaaaaa']);
};
var init_btn_tim_bucket = function (bucket) {
  document.getElementById('btn-tim-' + bucket + 's').onclick = btngroup_click(function () {
    options.bucket_size = bucket;
    count_with_options();
  });
};
init_btn_tim_bucket(15);
init_btn_tim_bucket(30);
init_btn_tim_bucket(60);
init_btn_tim_bucket(120);
init_btn_tim_bucket(300);
document.getElementById('btn-tim-count').onclick = btngroup_click(function () {
  options.disp_mode = 0;
  count_with_options();
});
document.getElementById('btn-tim-percentage').onclick = btngroup_click(function () {
  options.disp_mode = 1;
  count_with_options();
});


var a;

var start_time = -3600;   // 17:00
var end_time = 12600;     // 21:30
// 节目
var programmes = [
  [ 20, 44, '开场舞1'],
  [ 25, 33, '开场舞2'],
  [ 27, 54, '* 开场视频&倒计时'],
  [ 33, 15, '* 主持人报幕'],
//[ 36, 34, '幕间词1：梦'],
  [ 39, 20, '高二(4)/创意打击乐演奏 Click Click'],
  [ 43,  7, '高二(8)/舞蹈 Smooth Criminal'],
  [ 48, 20, '紫竹校区/歌曲 梦回西厢'],
  [ 57,  9, '高一(2)/现代舞 玉生烟'],
  [ 62, 53, '* 抽奖环节一'],
  [ 65, 19, '魔术社/纸牌幻觉'],
  [ 73, 58, '范永武、森利一郎、中濑古宽斗、程震霄/武术'],
  [ 79, 21, '教师：刘睛敏、傅振良 歌曲/十年'],
  [ 82, 54, '* 校友新年祝福视频一'],
  [ 99, 14, '张江Vortex学生乐队/歌曲 真的爱你'],
  [106, 10, '科协/好像有什么不科学'],
  [109, 53, "高二境外/舞蹈 Darling! I'm a good boy"],
  [115, 53, '高二(3)/小品 全民男神'],
  [127, 24, '* 抽奖环节二 & 校园文化艺术节专场颁奖'],
  [130, 24, '刘海正、吴旻玥/歌曲 A Moment Like This'],
  [135, 41, '高二(1)/动作小品 疯狂的乒乓球'],
  [142, 14, '教师：刘希蕾、严婕、杨一菲、马晓磊、李卓辰/舞蹈 Barbarbar'],
  [145, 27, '* 校友新年祝福视频二'],
  [160, 50, '紫竹校区Still乐队/歌曲 T1213121+Whatya want from me'],
  [168, 21, '高一(10)/相声 我与巨神'],
  [175, 46, '高一(2)/舞蹈 菁菁校园'],
  [179, 33, '晨晖爱乐/管弦乐演奏 Victory'],
  [184, 23, '* 抽奖环节三 & 校长新年致辞'],
  [188, 49, '* 校友新年祝福视频三'],
  [191, 47, '紫竹话剧社/舞台剧 解救何小天'],
  [206, 13, '* 校友新年祝福视频四（SJTU）'],
  [212, 42, '街舞社/舞蹈 Bang Bang Bang'],
  [217, 45, '高三全体/合唱 爱因为在心中'],
  [223, 36, '高一(6)/歌曲 & 团学联集体谢幕舞蹈 High School Musical'],
  [229, 53, '* 谢幕后']
];
var replay_offset = 2134;
programmes = programmes.map(function (e) {
  return { start: e[0] * 60 + e[1] - replay_offset, name: e[2] };
});
function _02d(x) { return x < 10 ? '0' + x : x; }
function rel_time(seconds, disp_seconds /* = false */) {
  seconds += 18 * 3600;
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  seconds = seconds % 60;
  return hours + ':' + _02d(minutes) + (disp_seconds ? ':' + _02d(seconds) : '');
}
// 把字符串表示的enum值和时间转换成数值方便处理
function preprocess(a) {
  var account_names = {'学生电视台': 0, '校友联络会': 1};
  var result_names = {'由审核员批准': 0, '由审核员拒绝': 1, '系统自动批准': 2, '系统自动拒绝': 3, '人工审核中': 4, '未审核': 5};
  var color_names = {'白色': 0, '红色': 1, '绿色': 2, '蓝色': 3};
  var position_names = {'顶部': 0, '底部': 1};

  var date_parse = function (d) {
    if (!d) return -1;
    return ((d.charCodeAt(11) - 48) * 10 + d.charCodeAt(12) - 48) * 3600 +
      ((d.charCodeAt(14) - 48) * 10 + d.charCodeAt(15) - 48) * 60 +
      ((d.charCodeAt(17) - 48) * 10 + d.charCodeAt(18) - 48) - 64800;
  };

  for (var i = 0; i < a.length; ++i) {
    a[i].official_account = account_names[a[i].official_account];
    a[i].color = color_names[a[i].color];
    a[i].position = position_names[a[i].position];
    a[i].check_result = result_names[a[i].check_result];
    a[i].send_time = date_parse(a[i].send_time);
    a[i].assign_time = date_parse(a[i].assign_time);
    a[i].check_time = date_parse(a[i].check_time);
    a[i].message = a[i].message.toString();
    // 计算当时的节目
    var m = 0; while (m < programmes.length && programmes[m].start < a[i].send_time) ++m; --m;
    a[i].programme = m;
  }
}


var visualize;

var count_bargraph = function (categorizer, colours) {
  var data = [];
  var counter = [];
  var max_group_id = 0;
  var bucket_size = options.bucket_size;
  var min_bucket = Math.floor(start_time / bucket_size),
      max_bucket = Math.floor(end_time / bucket_size);
  for (var i = 0; i < a.length; ++i) {
    var bucket_id = Math.floor(a[i].send_time / bucket_size);
    var group_id = categorizer(a[i]);
    if (max_group_id < group_id) max_group_id = group_id;
    data[bucket_id] = data[bucket_id] || [ 0 ];
    ++data[bucket_id][0];
    data[bucket_id][group_id] = (data[bucket_id][group_id] || 0) + 1;
  }
  for (var i = min_bucket; i <= max_bucket; ++i) {
    counter.push({bucket_start: i * bucket_size, values: data[i] || [ 0 ]});
  }
  counter.sort(function (a, b) { return a.bucket_start - b.bucket_start; });
  visualize(counter, max_group_id, colours);
};

d3.json('2016newyeardanmaku.json', function (err, json) {
  if (err) return console.log(err);
  preprocess(json);
  a = json;
  /*count_bargraph(function (d) {
    if (d.check_result === 1 || d.check_result === 3) return 1;
    else return 2;
  }, ['#ff6688', '#22ff44']);*/
  count_bargraph(function (d) {
    var b1 = d.message.includes('东山'), b2 = d.message.includes('蔡');
    if (b1) return b2 ? 1 : 2;
    else return b2 ? 3 : 4;
  }, ['#2222aa', '#8888ff', '#66ccff', '#aaaaaa']);
});

var margin = {vertical: 40, horizontal: 40};
var width = document.getElementById('main').clientWidth - 2 * margin.horizontal, height = 480 - 2 * margin.vertical;

var x_scale = d3.scale.ordinal().rangeBands([0, width], 0);
var y_scale = d3.scale.linear().range([height, 0]);
var x_axis = d3.svg.axis().scale(x_scale).orient('bottom');
var y_axis = d3.svg.axis().scale(y_scale).orient('left').ticks(10);

var svg = d3.select('main').append('svg')
    .attr('width', width + 2 * margin.horizontal)
    .attr('height', height + 2 * margin.vertical)
  .append('g')
    .attr('transform', 'translate(' + margin.horizontal + ', ' + margin.horizontal + ')');

visualize = function (data, groups, colours) {
  svg.selectAll('rect').remove();
  svg.selectAll('g').remove();

  x_scale.domain(data.map(function (d) { return d.bucket_start; }));
  x_axis.tickFormat(function (d) { return (parseInt(d) % 1200 === 0) ? rel_time(d) : ''; });
  var domain_max = d3.max(data, function (d) { return d.values[0]; });
  y_scale.domain([0, domain_max]);
  y_axis.tickFormat(function (d) {
    return options.disp_mode === 0 ? d.toString() : Math.round(100 * d / domain_max).toString() + '%';
  });
  svg.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(x_axis);
  svg.append('g')
    .call(y_axis);
  var enter = svg.selectAll('.bar').data(data).enter();
  for (var i = 1; i <= groups; ++i) {
    enter.append('rect')
      .attr('class', 'bar')
      .attr('style', 'fill: ' + colours[i - 1])
      .attr('x', function (d) { return x_scale(d.bucket_start); })
      .attr('width', x_scale.rangeBand() + 0.15)
      .attr('y', height)
      .attr('height', 0)
      .transition()
        .delay(function (d) { return d.t_delay || (d.t_delay = Math.random() * 500); })
        .duration(function (d) { return d.t_duration || (d.t_duration = Math.random() * 400 + 800); })
        .attr('y', function (d) {
          d.subtotal = (d.subtotal || 0) + (d.values[i] || 0);
          return y_scale(d.subtotal * (options.disp_mode === 0 ? 1 : domain_max / d.values[0]));
        })
        .attr('height', function (d) {
          return height - y_scale((d.values[i] || 0) * (options.disp_mode === 0 ? 1 : domain_max / d.values[0]));
        });
  }
};
