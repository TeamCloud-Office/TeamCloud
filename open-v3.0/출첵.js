function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal"))
    return;
  var actions = sbn.getNotification().actions;
  if (actions == null)
    return;
  var act = actions[actions.length - 1];
  var bundle = sbn.getNotification().extras;
  var msg = bundle.get("android.text").toString();
  var sender = bundle.getString("android.title");
  var room = bundle.getString("android.subText");
  if (room == null)
    room = bundle.getString("android.summaryText");
  var isGroupChat = room != null;
  var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, act, room, false, "");
  var icon = bundle.getParcelable('android.messagingUser').getIcon().getBitmap();
  var image = bundle.getBundle("android.wearable.EXTENSIONS");
  if (image != null)
    image = image.getParcelable("background");
  var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
  com.xfl.msgbot.application.service.NotificationListener.e.put(room, act);
  responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName);
}

const File = java.io.File;
let UseData = "sdcard/BotData/admin/UseData.json";

// LocalStorage :)
const _storageData = loadStorageData(UseData);
const localStorage = {
  hasItem: (key) => {
    return _storageData.containsKey(key);
  },
  setItem: (key, value) => {
    _storageData[key] = value;
    localStorage.save();
  },
  getItem: (key, /* @optional */ def) => {
    if (!def) def = null;

    let data = _storageData[key];
    if (!data)
      return def;
    return data;
  },
  save: () => FileStream.write(UseData, JSON.stringify(_storageData))
};

function loadStorageData(filePath) {
  let exists = new File(filePath).exists();
  if (!exists)
    return {};

  try {
    let raw = FileStream.read(filePath);
    return JSON.parse(raw);
  } catch (e) {
    Log.e("Failed to parse LocalStorage data: " + e);
  }

  return {};
}

// Prototypes..
Object.prototype.containsKey = function (key) {
  return Object.keys(this).includes(key);
};

let user = localStorage.getItem(sender);


const path = 'sdcard/BotData/출석목록.txt'; //출석목록이 저장될 경로

const Lw = '​'.repeat(500); //전체보기화 문자

const fs = FileStream;

const line = '━'.repeat(9);



if (!fs.read(path)) fs.write(path, '{}'); //만약 해당 경로에 파일이 없다면 파일 생성

let json = JSON.parse(fs.read(path)); //파일에 있는 데이터를 JSON형식으로 json변수에 대입

if (json['today'] == undefined) json['today'] = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate();

if (json['list'] == undefined) json['list'] = {};


function responseFix(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {


  var room_list = [];

  if (msg && room_list.indexOf(room) == -1) room_list.push(room);

  if (sender.includes('\u202E').valueOf()) sender.replace(/\\u202e/gi, '').split('').reverse().join('');

  let today = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate();

  if (json['today'] != today) {
    json['today'] = today;
    json['list'] = {};
    fs.write(path, JSON.stringify(json, null, 4));
  }

  if (json['list'][room] == undefined) json['list'][room] = [];


  if (msg == 'ㅊㅊ') {
    if (FileStream.read(UseData).includes(sender) == true) {
      if (user.ban == true) replier.reply('나 너 싫어!');

      if (json['list'][room].includes(sender).valueOf()) {
        replier.reply("출석체크✔️\n" + Lw + "[" + "[" + user.nickname + "]" + sender + "]" + "야, 이미 출석을 했어");
      } else {
        const rank = (Number(json['list'][room].length) + 1);
        replier.reply("출석체크✔️\n" + Lw + "[" + "[" + user.nickname + "]" + sender + "]야, 출석체크 완료했어! \n► 오늘의 [" + "[" + user.nickname + "]" + sender + "]의 순위: " + rank);
        user.teamcloud_coin + 10;
        replier.reply("코인 지급\n" + Lw + "[" + "[" + user.nickname + "]" + sender + "]야, <출첵 완료>(으)로 <10>coin이 지급되었어! \n►현재 [" + "[" + user.nickname + "]" + sender + "]는 <" + user.teamcloud_coin + ">원이 있어!");
        json['list'][room].push(sender);
      }
      //UseData
      user.attendance.today_ranking = rank;
      user.attendance.count++;
      if (rank > 0 && rank <= 10) user.attendance.achieve[(rank - 1)]++;
      if (rank == 1) user.attendance.first_count++;
      fs.write(path, JSON.stringify(json, null, 4));
      localStorage.save();
      return;
    }

  } else {
    replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
    return;
  }

  if (msg == 'ㅊㅊㅁ') {
    if (FileStream.read(UseData).includes(sender) == true) {
      if (user.ban == true) replier.reply('나 너 싫어!');
      if (json['list'][room] == undefined) {
        replier.reply("출석순위✔️\n" + Lw + "아직 아무도 출첵을 안했어! \nㅊㅊ을 입력해 출석해봐!");
        return;
      }
      if (json['list'][room].length < 1) {
        replier.reply("출석순위✔️\n" + Lw + "아직 아무도 출첵을 안했어! \nㅊㅊ을 입력해 출석해봐!");
        return;
      }
      replier.reply("출석순위✔️\n" + '[' + room + '] 의 출석순위이야' + Lw + '\n\n' + json['list'][room].map(e => json['list'][room].indexOf(e) + 1 + '위ㅣ' + e).join('\n\n'));
      return;
    } else {
      replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
      return;
    }
  }

  if (msg == 'ㄴㅊㅊ') {
    if (FileStream.read(UseData).includes(sender) == true) {
      if (user.ban == true) replier.reply('나 너 싫어!');
      if (user.attendance == undefined) return replier.reply("내출석✔️\n" + Lw + '[' + "[" + user.nickname + "]" + sender + ']야, 넌 아직 출석을 한 적이 없어.');
      const myinfo = user.attendance;
      let list = [];
      for (i = 0; i < myinfo['achieve'].length; i++) {
        list.push((i + 1) + '위 : ' + myinfo['achieve'][i] + '회');
      }
      return replier.reply("내 출석 현황✔️\n" + Lw + room + '의 출석현황' + Lw + '\n' + line + '\n오늘순위 : ' + myinfo['today_ranking'] + '\n누적 1등 횟수 : ' + myinfo['first_count'] + '\n출석 횟수 : ' + myinfo['count'] + '\n' + line + '\n' + list.join('\n'));
    } else {
      replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
    }
  }
}

function onStartCompile() {
  fs.write(path, JSON.stringify(json, null, 4));
  localStorage.save();
}