const FS = FileStream;

var 룸 = {};

const Lw='\u200b'.repeat(500);

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

  if(룸[room]==undefined) 룸[room] = true;

  if(msg.startsWith("ㅂ ")){
    if(FileStream.read(UseData).includes(sender)==true){
      if (user.ban == false) replier.reply('나 너 싫어!');
      var 밥 = msg.substring(2);
      user.feed.feed = 밥
      localStorage.save();
      replier.reply("이제 내 밥은 "+밥+" 이야!");
    }else{
      replier.reply("🔹약관 미동의\n"+Lw+"["+sender+"]"+' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
    }
  }

  if(msg=="ㅂㅈㄱ"){
    if(룸[room]==true){
      if(FileStream.read(UseData).includes(sender)==true){
        if (user.ban == false) replier.reply('나 너 싫어!');
        user.like = user.like + Math.floor(Math.random()*2);
        replier.reply(밥+" 을(를) 먹었어!\n"+"호감도 : "+user.like+"%");
        localStorage.save();
        룸[room] = false;
        java.lang.Thread.sleep(30000);
        룸[room] = true;
      }else{
        replier.reply("🔹약관 미동의\n"+Lw+"["+sender+"]"+' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
      }
    }else{
      if(룸[room]==false) replier.reply("잠시만..");
    }
  }

  if((user.like % 50) == 0){
    user.teamcloud_coin = user.teamcloud_coin + user.like/50
    replier.reply("코인 지급\n" + Lw + "[" + "[" + user.nickname + "]" + sender + "]야, <내가 기분이 좋아서>(으)로 <"+user.like/50+">coin이 지급되었어! \n►현재 [" + "[" + user.nickname + "]" + sender + "]는 <" + user.teamcloud_coin + ">원이 있어!");
  }
}
   
   
   
   function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras;

        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null) room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null) room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null) image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}

   