$(document).ready(function(){
  // 画面更新のコールバックを設定
  $('input[type="number"]').bind('input', function () {
    calculate_all();
  });

  // 初回の画面更新
  calculate_all();
});

function up_talent(from, to) {
  const talent_materials = [
    // 天賦素材1, 2, 3, 週BOSS, 敵ドロップ1, 2, 3, 知恵の輪, モラ
    [3, 0,  0, 0, 6, 0,  0, 0, 12500],
    [0, 2,  0, 0, 0, 3,  0, 0, 17500],
    [0, 4,  0, 0, 0, 4,  0, 0, 25000],
    [0, 6,  0, 0, 0, 6,  0, 0, 30000],
    [0, 9,  0, 0, 0, 9,  0, 0, 37500],
    [0, 0,  4, 1, 0, 0,  4, 0, 120000],
    [0, 0,  6, 1, 0, 0,  6, 0, 260000],
    [0, 0, 12, 2, 0, 0,  9, 0, 450000],
    [0, 0, 16, 2, 0, 0, 12, 1, 700000]
  ]

  if (from > to) {
    console.error('Invalid parameters.')
    console.error("parameters(" + from + "," + to + ")")
    throw new Error('Invalid parameters.');
  }

  var required_materials = Array(talent_materials[0].length);
  required_materials.fill(0);
  talent_materials.slice(from - 1, to - 1).forEach(mats => {
    for(let index = 0; index < required_materials.length; index++) {
      required_materials[index] += mats[index];
    }
  });

  return required_materials;
}

function calculate_all() {
  // 天賦素材の計算
  var kougeki_from = parseInt($('#kougeki_lv_from').val());
  var kougeki_to = parseInt($('#kougeki_lv_to').val());
  var skill_from = parseInt($('#skill_lv_from').val());
  var skill_to = parseInt($('#skill_lv_to').val());
  var bakuhatsu_from = parseInt($('#bakuhatsu_lv_from').val());
  var bakuhatsu_to = parseInt($('#bakuhatsu_lv_to').val());
  try {
    var kougeki_materials = up_talent(kougeki_from, kougeki_to);
    var skill_materials = up_talent(skill_from, skill_to);
    var bakuhatsu_materials = up_talent(bakuhatsu_from, bakuhatsu_to);
  } catch {
    set_message();
    return false;
  }

  // 天賦素材の総量計算
  var total_talent_matrials = Array(kougeki_materials.length);
  total_talent_matrials.fill(0);
  for(let index = 0; index < total_talent_matrials.length; index++) {
    total_talent_matrials[index] += kougeki_materials[index];
    total_talent_matrials[index] += skill_materials[index];
    total_talent_matrials[index] += bakuhatsu_materials[index];
  }

  // 天賦素材量をページに反映
  console.log(total_talent_matrials);
  for (let index = 0; index < total_talent_matrials.length; index++) {
    $('#talents_'+index).text(total_talent_matrials[index]);
  }

  clear_message();
  return true;
}

function set_message() {
  $('#character_message').text('【設定に誤りがあります】');
}

function clear_message() {
  $('#character_message').text('');
}
