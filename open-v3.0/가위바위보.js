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

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

  let UseData = "sdcard/BotData/admin/UseData.json";
  const Lw = '\u200b'.repeat(500);


  if (msg.startsWith('ㄱㅁㅂ')) {
    let a = Math.floor(Math.random() * 3);
    if (FileStream.read(UseData).includes(sender).valueOf()) {
      if (user.ban == false) replier.reply('나 너 싫어!');
      switch (msg.substr(3).trim()) {
        case 'ㅁ':
          array = ["가위\n내가 졌네..ㅠㅠ", "바위\n비겼네!", "보\n내가 이겼당"];
          replier.reply(array[a]);
          break;
        case 'ㄱ':
          array = ["보\n내가 졌네..ㅠㅠ", "가위\n비겼네!", "바위\n내가 이겼당"];
          replier.reply(array[a]);
          break;
        case 'ㅂ':
          array = ["바위\n내가 졌네..ㅠㅠ", "보\n비겼네", "가위\n내가 이겼당"];
          replier.reply(array[a]);
          break;
        default:
          replier.reply('ㄱ, ㅁ, ㅂ 중에서 하나를 입력해줘!');
          break;
      }
    } else {
      replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
      return;
    }
  }
}