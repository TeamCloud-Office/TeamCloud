/*
* 제작자 : Yellu(옐루)
*
* Copyright (C) 2023 Yellu
*
* BY-NC-SA(저작자표시-비영리-동일조건변경허락)
*
* 본 주석 삭제 금지
*
*
* 본 코드에는 무단 복제/배포를 막기 위해 몇가지 코드가 수정되어 있습니다.
    참고바랍니다.
*/








let Admin = {
    men: null,
    Hash: -1
}

let fs = FileStream;
//FileStream

let men, pHash, code = "";
//men와 pHash와 code 변수의 값을 ""로 설정하기
let admin = ["sdcard/Kakaotalk_Bot_Data/admin.json"];
//관리자 목록

if(fs.read(admin) == undefined) fs.write(admin, "{}");

let Json = JSON.parse(fs.read(admin));




function responseFix(msg, sender, replier, ImageDB) {
//시작하기

    let profileHash = ImageDB.getProfileHash();
    //프로필해시코드 변수

    let send_room = "방";
    //관리자 인증 번호를 전송할 방
    //참고 : 방은 1개만 기재해야 해요!

    if(msg == "!인증"){
        //메시지 입력
        if(fs.read(admin).includes(sender)==true){
            //관리자라면
            replier.reply("["+sender+"] 님은 이미 관리자예요!");
        }else{
        //관리자가 아니면
            if(code == ""){
                code = "";
                for(var n = 0; n < 4; n++) {
                    code += Math.floor(Math.random() * 10);
                }//인증 코드 변수가 비어있다면 인증번호 4자리를 code에 삽입
                replier.reply("관리자 인증 코드를 "+sendroom+"(으)로 전송합니다.");
                replier.reply(sendroom, "코드 : "+code);
                //send_room으로 코드 전송
                men = sender;
                //name에 이름 삽입
                pHash = profileHash;
                //pHash에 프로필해시코드 삽입
                java.lang.Thread.sleep(10 * 1000);
                //입력 제한시간은 10초로 설정
                if(code != ""){
                    replier.reply("입력 가능 시간을 초과하였습니다.");
                    code = "";
                    men = null;
                    pHash = null;
                }
                //제한시간 내에 전송하지 않았다면 인증 취소하기
            }else{
                replier.reply("이미 인증이 진행중입니다.");
            }
            //제한시간 내에 인증번호를 다시 요청할 경우
        }
    }else if(code == msg && men == sender && pHash == profileHash){
            if(Json[sender] == undefined){
                Json[sender]={
                    "Hash": Hash
                };
            }
            fs.write(admin, JSON.stringify(Json));
            replier.reply(sender+"님은 이제 관리자예요!");
            code = "";
            Admin.Hash = Hash;
            Admin.men = sender;
            men = null;
            pHash = null;
    }//인증번호가 맞을 경우 관리자 목록에 추가하기
    



    try{
        if(msg.startsWith("ev.")){
          if(fs.read(admin).includes(sender)==true && fs.read(admin).includes(profileHash)==true){
                let time1 = Date.now();
                replier.reply(eval(msg.substr(3)));
                java.lang.Thread.sleep(00);
                let time2 = Date.now();
                let time = (time2-time1);
                replier.reply("RunTime : "+ time +"ms");
            }else{
                replier.reply("관리자가 아닙니다.");
            }//관리자 목록에 닉네임이 포함되어 있다면 이발 명령어를 실행하기
        }
    }catch(e){
        replier.reply(e);
    }//에러가 발생할 경우 에러 전송하기

}//끝내기


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