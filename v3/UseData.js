//관리
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


let Lw = '\u200b'.repeat(500);

let fs = FileStream;

let UseJson = JSON.parse(fs.read(UseData));

var flag = false;


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


  let room_list = [];
  if (msg && room_list.indexOf(room) == -1) room_list.push(room);

  if (sender.includes('\u202E').valueOf()) sender.replace(/\\u202e/gi, '').split('').reverse().join('');

  if (!fs.read(UseData)) fs.write(UseData, '{}');


  if (msg == '!약관') {
    flag = true;
    replier.reply("🔹️약관" + "\u200b" + Lw + fs.read("sdcard/BotData/admin/terms.txt"));
    replier.reply("약관을 **읽고** 동의 라고 입력해줘\n(안 읽어서 생기는 불이익에 대해선 책임지지 않아!)");
  }

  if (msg == "동의") {
    if (flag) {
      if (fs.read(UseData).includes(sender) == true) {
        replier.reply("이미 나랑 친군뎅..");
      } else {
        if (UseJson[sender] == undefined) {
          UseJson[sender] = {
            'admin': false, //관리자
            'ban': false, //밴
            'teamcloud_coin': 0, //팀클 코인
            'warning_count': 0, //경고 횟수
            'chating_count': 0, //채팅 횟수
            'attendance': { //출석
              'today_ranking': 0, //오늘 랭킹
              'first_count': 0, //첫 출석
              'count': 0, //출석 횟수
              'achieve': [ //업적
                0, //1위 횟수
                0, //2위 횟수
                0, //3위 횟수
                0, //4위 횟수
                0, //5위 횟수
                0, //6위 횟수
                0, //7위 횟수
                0, //8위 횟수
                0, //9위 횟수
                0 //10위 횟수
              ]
            },
            'feed': { //밥
              'feed': '밥' //밥
            },
            'nickname': '사용자', //닉네임
            'like': 1 //호감도
          };
        }
        fs.write(UseData, JSON.stringify(UseJson));
        replier.reply('🔹️동의됨\n\n' + "[" + user.nickname + "]" + sender + '야, 이제 나랑 놀자!');
        user.teamcloud_coin + 100;
        replier.reply("코인 지급\n" + Lw + "[" + "[" + user.nickname + "]" + sender + "]야, <신규 가입>(으)로 <20>coin이 지급되었어! \n►현재 [" + "[" + user.nickname + "]" + sender + "]는 <" + user.teamcloud_coin + ">원이 있어!");
        /*replier.reply("현재 신규 가입이 불가능합니다. ");*/
        flag = false;
        localStorage.save();
        return;
      }
    } else {
      replier.reply("약관을 읽지 않았어!\n!약관 을 입력해 약관을 읽고 동의해줘!");
    }
  }

  if (msg == "철회") {
    replier.reply("내 짱친 옐루나 초코한테 말해봥!");
  }




  //-------------------





  if (msg.startsWith('ban')) {
    if (user.admin == true) {
      ban_name = msg.substr(4);
      replier.reply('난 이제 ' + ban_name + ' 을/를 싫어해!');
      localStorage.getItem(ban_name).ban = true;
    }
  }
  if (msg.startsWith('unban')) {
    if (user.admin == true) {
      ban_name = msg.substr(6);
      replier.reply('난 이제 ' + ban_name + ' 을/를 좋아해!');
      localStorage.getItem(ban_name).ban = false;;
    }
  }

  if (msg.startsWith('wp')) {
    if (user.admin == true) {
      w_name = msg.substr(3);
      replier.reply('옐로 카드 1 장 추가!');
      localStorage.getItem(w).warning_count++;
    }
  }
  if (msg.startsWith('wm')) {
    if (user.admin == true) {
      w_name = msg.substr(3);
      replier.reply('옐로 카드 1장 삭제!');
      localStorage.getItem(w).warning_count--;
    }
  }
}