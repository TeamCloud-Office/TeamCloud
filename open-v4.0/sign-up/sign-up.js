import {
    prefix,
    Lw,
    fs,
    cut,
    getDate,
    Kakaocord,
    User,
    msg,
    Pos,
    chat_log,
    random,
    Coin,
    Nickname,
    ogimg,
    c_path,
  } from "A";

function onMessage(event) {

    if (event.message == prefix + '약관') {
        event.room.send([
            msg.noti,
            "✅ Eric 이용약관 동의",
            "에릭의 대부분의 기능을 이용하려면 약관에 동의해야 합니다.",
            "아래 약관 정독 후 [에릭아 친구맺기]라 입력해주세요.",
            "약관을 읽지 않고 동의한 경우에도 약관에 동의한 것으로 간주되며, 약관을 위반한 경우에는 이용이 제한될 수 있습니다.",
            "▶개인정보처리방침 : https://www.team-cloud.kro.kr/privacy",
            "▶봇 이용약관 : https://www.team-cloud.kro.kr/terms"
        ].join('\n'));
    }

    if (event.message == prefix + "친구맺기") {
        if (!User.read(event.sender.name)) {
            //사용자 정보 없음  
        } else {
            //사용자 정보 있음
            if ((User.edit(event.sender.name, false).hash).includes(event.sender.profileHash)) return event.room.send("이미 나랑 친군뎅..");
            if (User.edit(event.sender.name, false).name == event.sender.name) return event.room.send("너랑 똑같은 이름의 친구가 있어서 내가 헷갈릴것 같아서 말인데 다른이름으로 변경해서 와죠!");
        }
        let Data = {
            name: event.sender.name,
            //이름
            hash: event.sender.profileHash,
            //해시
            admin: false,
            //관리자
            ban: false,
            //밴
            coin: 0,
            //팀클 코인
            warn: 0,
            //경고 횟수
            feed: '밥',
            //밥
            nickname: [],
            //닉네임
            like: 0,
            //호감도
            stock: {},
            etc: []
            //기타
        };
        User.set(event.sender.name, Data);
        User.save();


        event.room.send(Coin(event.sender.name, "에릭과 친구맺기", 20));
        event.room.send(Nickname(event.sender.name, "에릭과 친구맺기 성공", "사용자"));
        event.room.send("[" + User.edit(event.sender.name, false).nickname + "]" + event.sender.name + '야, 이제 나랑 놀자!');
        //event.room.send("현재 나랑 친구할 수 없어..");
        User.save();
    }
}