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

  const Lw='\u200b'.repeat(500); //전체보기 문자
  var 대답 = ["짝", "홀"];

  if(msg.indexOf("ㅎㅈ") == 0){
    if(FileStream.read(UseData).includes(sender)==true){
      if (user.ban == true) replier.reply('나 너 싫어!');
      var 홀짝 = msg.split(" ")[1];
        if(대답.indexOf(홀짝) != -1){
          if(홀짝 == 대답[Math.floor(Math.random() * 10) + 1 % 2]){
            replier.reply("정답! 숫자는 " + num + "이었어!");
          }else{
            replier.reply("오답! 숫자는" + num + "이었어ㅠㅠ");
          }
        }else{
            replier.reply("ex) ㅎㅈ 홀 / ㅎㅈ 짝");
        }
      } else {
         replier.reply("🔹약관 미동의\n"+Lw+"["+sender+"]"+' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
         return;
      }
  }  
}
