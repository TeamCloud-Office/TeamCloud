let A = Bridge.getScopeOf("A");

let onf = "on";

function onProjectButtonClicked(id) {
    if (id == "on") {
        onf = "on";
        Api.makeNoti('eval', onf);
        Api.showToast('eval 기능 : ' + onf, 0);
    }
    if (id == "off") {
        onf = "off";
        Api.makeNoti('eval', onf);
        Api.showToast('eval 기능 : ' + onf, 0);
    }
}

function onCustom(event) {
    //if((event.room.name).includes("TeamCloud")) Log.d(event.sender.name + " + " + event.sender.id);
}

function onMessage(event) {

    let fs = A.fs;
    let Lw = A.Lw;
    let file_sc = "sdcard/msgbot/Bots/";
    let file_data = "sdcard/BotData/";
    let test = "본 메시지는 테스트 메시지 입니다!";


    if (event.message.startsWith(A.prefix + "e")) {
        if (onf == "on") {
            if (!A.user.read(event.sender.name)) event.room.send("나한테 명령하지마!");
            if (A.user.edit(event.sender.name, false).admin) {
                try {
                    var before = Date.now();
                    event.room.send(A.msg.noti + eval((event.message).substr(5)) + "\n\n[" + Env.runtimeName + " " + Env.runtimeVersion + "]에서 실행됨");
                    java.lang.Thread.sleep(0);
                    var after = Date.now();
                    event.room.send("RunTime : " + (after - before) + "ms");
                } catch (e) {
                    event.room.send("[" + e.name + "]\n" + e.message + "\n" + "line : #" + e.lineNumber);
                }
            } else {
                event.room.send("나한테 명령하지마!");
            }
        } else if (onf == "off") {
            event.room.send("eval 기능이 꺼져있어!");
        }
    }
}



/*
function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var profileId = sbn.getUser().hashCode();
    var isMultiChat = profileId != 0;
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras;
        var imageDB; 
        var replier; 
        var sender; 
        var msg; 
        var room; 
        var isGroupChat;
        if(android.os.Build.VERSION.SDK_INT < 30) {
        imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(bundle.get("android.largeIcon"), null);
        room = bundle.get('android.subText');
        isGroupChat = room != null;
        if (room == null) room = sender;
        msg = bundle.get('android.text');
        sender = bundle.get('android.title');
        replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, profileId != 0, isMultiChat);
        }
*/

function onNotificationPosted(sbn, sm) {

    let packageName = sbn.getPackageName();

    if (packageName == "com.kakao.talk") {

        let bundle = sbn.getNotification().extras;

        let sender = bundle.get("android.title");

        let event = {
            packageName: packageName,
            sender: {
                name: bundle.get("android.title"),
                id: bundle.get("android.messages")[0].get("sender_person").key
            },
            message: bundle.get('android.text'),
            room: {
                name: bundle.get('android.subText'),
            },
            bundle: bundle
        };

        if (this.hasOwnProperty("onCustom")) {
            onCustom(event);
        }

    };

}