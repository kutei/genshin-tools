$(document).ready(function(){
  // 画面更新のコールバックを設定
  $('input[type="number"]').bind('input', function () {
    calculate_all();
  });

  // 初回の画面更新
  calculate_all();
});

function character_ascension(from, to) {
  const ascension_level = [20, 40, 50, 60, 70, 80];
  const ascension_materials = [
    // 突破素材1, 2, 3, 4, BOSS, 敵ドロップ1, 2, 3, 特産品, 経験値本,モラ
    [1, 0, 0, 0,  0,  3,  0,  0,  3, 0, 20000],
    [0, 3, 0, 0,  2, 15,  0,  0, 10, 0, 40000],
    [0, 6, 0, 0,  4,  0, 12,  0, 20, 0, 60000],
    [0, 0, 3, 0,  8,  0, 18,  0, 30, 0, 80000],
    [0, 0, 6, 0, 12,  0,  0, 12, 45, 0, 100000],
    [0, 0, 0, 6, 20,  0,  0, 24, 60, 0, 120000]
  ];

  var required_materials = Array(ascension_materials[0].length);
  required_materials.fill(0);
  for (let idx = 0; idx < ascension_materials.length; idx++) {
    const mats = ascension_materials[idx];
    const level = ascension_level[idx];
    if (from <= level && level < to) {
      for(let index = 0; index < required_materials.length; index++) {
        required_materials[index] += mats[index];
      }
    }
  }

  return required_materials;
}

function check_chara_lv(lv) {
  if (0 < lv && lv <= 90) {
    return true;
  }
  return false;
}

function calculate_levels() {
  const wit3_exp = 20000;
  const wit3_mora = 4000;
  const ascension_level = [20, 40, 50, 60, 70, 80];
  const exp_table = [
    1000, 1325, 1700, 2150, 2625, 3150, 3725,
    4350, 5000, 5700, 6450, 7225, 8050, 8925, 9825,
    10750, 11725, 12725, 13775, 14875, 16800, 18000, 19250, 20550, 21875, 23250,
    24650, 26100, 27575, 29100, 30650, 32250, 33875, 35550, 37250, 38975, 40750,
    42575, 44425, 46300, 50625, 52700, 54775, 56900, 59075, 61275, 63525, 65800,
    68125, 70475, 76500, 79050, 81650, 84275, 86950, 89650, 92400, 95175, 98000,
    100875, 108950, 112050, 115175, 118325, 121525, 124775, 128075, 131400, 134775,
    138175, 148700, 152375, 156075, 159825, 163600, 167425, 171300, 175225, 179175,
    183175, 216225, 243025, 273100, 306800, 344600, 386950, 434425, 487625, 547200
  ]
  const lv_from = parseInt($('#character_lv_from').val());
  const lv_to = parseInt($('#character_lv_to').val());

  if (lv_from > lv_to || ! check_chara_lv(lv_from) || ! check_chara_lv(lv_to)) {
    console.error('Invalid parameters.(' + lv_from + ',' + lv_to + ')');
    return false;
  }

  // 突破素材の計算
  required_materials = character_ascension(lv_from, lv_to);

  // レベル上げ素材の計算
  var accrual_exp = 0;
  for (var lv = lv_from; ; lv++) {
    accrual_exp += exp_table[lv - 1];
    if (lv_to - 1 <= lv || ascension_level.includes(lv + 1)) {
      num_wit3 = Math.ceil(accrual_exp / wit3_exp);
      required_materials[9] += num_wit3;
      required_materials[10] += num_wit3 * wit3_mora;
      accrual_exp = 0;
      if (lv_to - 1 <= lv) break;
    }
  }

  // 素材量をページに反映
  console.log("character level:", required_materials);
  for (let index = 0; index < required_materials.length; index++) {
    $('#charalv_'+index).text(required_materials[index].toLocaleString());
  }

  return true;
}

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
  ];

  if (from > to || ! check_talent_lv(from) || ! check_talent_lv(to)) {
    console.error('Invalid parameters.(' + from + ',' + to + ')');
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

function check_talent_lv(lv) {
  if (0 < lv && lv <= 10) {
    return true;
  }
  return false;
}

function calculate_talents() {
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
    return false;
  }

  // 天賦素材の総量計算
  var total_talent_matrials = Array(kougeki_materials.length);
  total_talent_matrials.fill(0);
  for (let index = 0; index < total_talent_matrials.length; index++) {
    total_talent_matrials[index] += kougeki_materials[index];
    total_talent_matrials[index] += skill_materials[index];
    total_talent_matrials[index] += bakuhatsu_materials[index];
  }

  // 天賦素材量をページに反映
  console.log("talents:", total_talent_matrials);
  for (let index = 0; index < total_talent_matrials.length; index++) {
    $('#talents_'+index).text(total_talent_matrials[index].toLocaleString());
  }

  return true;
}

function calculate_all() {
  // 素材数の計算
  var suc_lv = calculate_levels();
  var suc_talents = calculate_talents();

  // メッセージの出力
  if (suc_lv && suc_talents){
    clear_message();
  } else {
    set_message();
  }
}

function set_message() {
  $('#character_message').text('【設定に誤りがあります】');
}

function clear_message() {
  $('#character_message').text('');
}
