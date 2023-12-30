const Lw = '\u200b'.repeat(500); //전체보기 문자


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




    //명령어

    //카카오톡 봇 커뮤니티
    if (msg.includes("봇목록").valueOf(true) && sender != "오픈채팅봇") {
        replier.reply('<카봇커 봇목록>' +
            Lw +
            FileStream.read("sdcard/BotData/admin/봇 목록.txt") +
            '\n\n\n\n◇자신의 봇이 적혀있지 않다면 "[TeamCloud 소속]옐루"를  맨션하셔서 자신의 봇 이름과 도움말 명령어를 보내주세요.\n문의사항이 있으시면 옐루를 맨션해주세요!');
    }


    //일반

    if (["명령어", "도움말"].includes(msg).valueOf()) replier.reply("🔹️도움말\n" + Lw + FileStream.read("sdcard/BotData/admin/도움말.txt"));

    if (msg === '!초대') replier.reply('🔹️초대 링크\n' + Lw + '나를 너의 방으로 초대하려면 아래버튼을 클릭해서 설문지를 작성해!\n팀클라우드.메인.한국/14');

    if (msg === '!커뮤니티') replier.reply('🔹️커뮤니티 링크\n' + Lw + '우리 집으로 가장!\n팀클라우드.메인.한국/15');


    if (msg.startsWith('ㄷ.')) {
        if (FileStream.read(UseData).includes(sender) == true) {
            if (user.ban == false) replier.reply('나 너 싫어!');
            if (msg.split('.').length != 3) return Api.replyRoom(room, '잘못된 형식이야.' + ㅋ + '형식: ㄷ.1.28');
            let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
            let day = new Date(new Date().getYear(), msg.split('.')[1], msg.split('.')[2]);
            let calculate = (today - day) / (1000 * 3600 * 24) * -1;
            if (calculate < 0) calculate = 365 - calculate * -1;
            if (calculate == 0) calculate = "Day";
            return Api.replyRoom(room, 'D-' + calculate);
        } else {
            replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
        }

    }

    if (msg.endsWith("확률은?")) {
        if (user.ban == false) replier.reply('나 너 싫어!');
        if (FileStream.read(UseData).includes(sender) == true) {
            var a = Math.floor(Math.random() * (100 - 1) + 1);
            var b = msg.split('확률은?', 1);
            replier.reply(b + "확률은 " + a + "% 이야.");
        } else {
            replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
        }
    }


    //단순답장 명령어
    if (msg == "응애") replier.reply("응애");



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