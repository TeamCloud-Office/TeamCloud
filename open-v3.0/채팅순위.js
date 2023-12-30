function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal")) return;
  var actions = sbn.getNotification().actions;
  if (actions == null) return;
  var act = actions[actions.length - 1];
  var bundle = sbn.getNotification().extras;

  var msg = bundle.get("android.text").toString();
  var sender = bundle.getString("android.title");
  var room = bundle.getString("android.subText");
  if (room == null) room = bundle.getString("android.summaryText");
  var isGroupChat = room != null;
  var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, act, room, false, "");
  var icon = bundle.getParcelable('android.messagingUser').getIcon().getBitmap();
  var image = bundle.getBundle("android.wearable.EXTENSIONS");
  if (image != null) image = image.getParcelable("background");
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




const fs = FileStream;

const path = 'sdcard/BotData/채팅순위/채팅순위.json'

const Lw = '\u200b'.repeat(500); //전체보기 문자

if (!fs.read(path)) fs.write(path, '{}'); //해당 경로에 파일이 없다면 파일 생성

let json = JSON.parse(fs.read(path)); //파일을 JSON 형태로 json변수에 담음



function hasConsent(sender) {
  if (FileStream.read(UseData).includes(sender) == true) {
    return true;
  } else {
    return false;
  }
}

function responseFix(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

  if (sender.includes('\u202E').valueOf()) sender.replace(/\\u202e/gi, '').split('').reverse().join(''); //이름에 반전문자가 들어가 있다면 제거


  if (hasConsent(sender)) {
    if (user.ban == true) return;
    if (json[room] == undefined) json[room] = {};
    if (json[room][sender] == undefined) json[room][sender] = 0;
    json[room][sender]++;
    json[room][sender] = user.chating_count;

    FileStream.write(path, JSON.stringify(json, null, 4));
    loadStorage.save();
  }

  if (user.chating_count >= 300) {
    if (user.ban == true) return;
    replier.reply("칭호 변경!\n" + Lw + "\n[" + "[" + user.nickname + "]" + sender + "]의 칭호가 <수다쟁이>로 변경됐어!\n\n" + user.nickname + " → 수다쟁이");
    user.nickname = '수다쟁이';
  }
  if (user.chating_count >= 500) {
    if (user.ban == true) return;
    replier.reply("칭호 변경!\n" + Lw + "\n[" + "[" + user.nickname + "]" + sender + "]의 칭호가 <투머치토커>로 변경됐어!\n\n" + user.nickname + " → 투머치토커");
    user.nickname = '투머치토커';
  }
  if (user.chating_count >= 1000) {
    if (user.ban == true) return;
    replier.reply("칭호 변경!\n" + Lw + "\n[" + "[" + user.nickname + "]" + sender + "]의 칭호가 <백수>로 변경됐어!\n\n" + user.nickname + " → 백수");
    user.nickname = '백수';
  }




  if (msg == 'ㅊㅌ') {
    if (FileStream.read(UseData).includes(sender) == true) {
      if (user.ban == true) replier.reply('나 너 싫어!');
      let list = [];
      for (i in json[room]) list.push(i + ' - 채팅횟수: ' + json[room][i] + '회');
      replier.reply('[' + room + '] 의 채팅순위야!' + Lw + '\n\n' + list.sort((a, b) => b.split(' - 채팅횟수: ')[1].split('회')[0] - a.split(' - 채팅횟수: ')[1].split('회')[0]).map(e => (list.indexOf(e) + 1) + '위ㅣ' + "[" + user.nickname + "]" + e).join('\n'));
      return;
    } else {
      replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
      return;
    }
  }


}

function onStartCompile() {
  fs.write(path, JSON.stringify(json, null, 4));
}