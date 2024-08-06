var path="sdcard/BotData/경고.txt";
    FS=FileStream;
    r="";

if(FS.read(path)==undefined){
    FS.write(path,"{}");
}

data=JSON.parse(FS.read(path));



function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName){

    NickName = msg.substr(7);

    if(data[sender]==undefined){ 
        data[sender]={
            name:sender,
            count:0
        };
    }

    if(msg == ".경고"){

        replier.reply(["<경고 도움말>","",".경고 차증 (이름)",".경고 차감 (이름)",".경고 리스트"].join("\n"));

    }

    if(msg.startsWith(".경고 차증 ")){

        if(data[NickName]===undefined){
            data[NickName]={
                name:sender,
                count:0
            };
        }

        data[NickName].count+=1;
        FS.write(path,JSON.stringify(data));
        replier.reply(NickName+"님의 경고 횟수를 1회 차증하였습니다.");

    }

    if(msg.startsWith(".경고 차감 ")){

        tmp=data[NickName].count-1;
        if(tmp<0){
            data[NickName].count=0;
        }else{
            data[NickName].count-=1;
            FS.write(path,JSON.stringify(data));
            replier.reply(NickName+"님의 경고 횟수를 1회 차감하였습니다.");
        }

    }

    if(msg == ".경고 리스트"){

        r="";
        for(var key in data){
            r+=key+" : "+data[key].count+"\n";
        }
        replier.reply(["<경고 리스트>\n",r.trim()].join("\n"));

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