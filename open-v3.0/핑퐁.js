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






var URL = "https://builder.pingpong.us/api/builder/63f73cbae4b04966c0b4c301/integration/v0.2/custom/{sessionId}"; // 핑퐁빌더에서 획득한 URL

const BotName = "에릭아";
let UseData = "sdcard/BotData/admin/UseData.json";
const Lw = '\u200b'.repeat(500);
var 룸 = {};

function responseFix(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {


    if (룸[room] == undefined) 룸[room] = true;

    if (msg.indexOf(BotName) !== -1) {
        if (FileStream.read(UseData).includes(sender) == true) {
            if (user.ban == true) replier.reply('나 너 싫어!');
            if (룸[room] == true) {
                replier.reply(FindResponse(SendMsg(RemoveName(msg))));
                룸[room] = false;
                java.lang.Thread.sleep(10000);
                룸[room] = true;
                return;
            } else {
                if (룸[room] == false) replier.reply("기다려줘..");
            }
        } else {
            replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
            return;
        }
    }
}


function RemoveName(_msg) {
    var spl = _msg.split(" ");
    var rtnText = "";
    for (var i = 0; i < spl.length; ++i) {
        if (spl[i].indexOf(BotName) === -1) {
            rtnText += spl[i] + " ";
        }
    }
    return rtnText;
}

function SendMsg(_msg) {
    const response = org.jsoup.Jsoup.connect(URL)
        .header('Authorization', 'Basic a2V5OjllYjExMjUyNWY5NjMyNDQ4OTZjZTdlZTQ0MGRmMTQ0') // 핑퐁빌더에서 획득한 Authorization
        .header('Content-Type', 'application/json')
        .header('Accept', 'application/json')
        .method(org.jsoup.Connection.Method.POST)
        .requestBody(JSON.stringify({
            "request": {
                "query": _msg
            }
        }))
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .execute();
    return JSON.parse(response.body());
}

function FindResponse(_json) {
    var replies = _json.response.replies;
    var obj, rtnText = "";
    for (var i = 0; i < replies.length; ++i) {
        obj = replies[i];
        if (obj.type === "text") {
            rtnText = obj.text;
            break;
        }
    }
    return rtnText;
}

function log_i(_funcName, _data) {
    if (libConst.def_Log) Log.i(_funcName + " func --- " + _data);
}

function log_e(_funcName, _data) {
    if (libConst.def_Log) Log.e(_funcName + " func --- " + _data);
}