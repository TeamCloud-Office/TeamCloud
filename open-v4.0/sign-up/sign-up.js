Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    FS,
    state,
    snd,
    getDate,
    c_path,
    Kakaocord,
    msg,
    Pos,
    chat_log,
    random,
    User,
    Coin,
    Nickname,
    ogimg
} = require("A");

function onMessage(event) {

    if (event.message == prefix + '약관') {
        event.room.send([
            msg.noti,
            "✅ Eric 이용약관 동의",
            "에릭의 대부분의 기능을 이용하려면 등록해야 합니다.",
            "아래 약관 정독 후 [에릭아 등록]을 입력해주세요.",
            "약관을 읽지 않고 동의한 경우 약관에 동의한 것으로 간주되며, 약관을 위반한 경우에는 사용이 제한될 수 있습니다.",
            "▶개인정보처리방침 : https://www.team-cloud.kro.kr/privacy",
            "▶봇 사용약관 : https://www.team-cloud.kro.kr/terms"
        ].join('\n'));
    }

    if (event.message == prefix + "등록") {
        if (!User.read(event.sender.name)) {
            //사용자 정보 없음  
        } else {
            //사용자 정보 있음
            if (User.read(event.sender.name)) return event.room.send("이미 등록하셨습니다.");
            if (User.edit(event.sender.name).name == event.sender.name) return event.room.send("동일한 이름이 있습니다.\n이름을 변경하여 등록해주시길 바랍니다.");
        }
        let Id = User.addID();
        let Data = {
            name: event.sender.name,
            //이름
            id: Id,
            //사용자 Id
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
        User.set(Id, Data);
        User.save();


        event.room.send(Coin(event.sender.name, "사용자 등록", 20, false));
        event.room.send(Nickname(event.sender.name, "사용자 등록 성공", "사용자", false));
        event.room.send([
            msg.noti,
            "[" + User.edit(event.sender.name).nickname + "]" + event.sender.name + "님, 사용자 등록이 완료되었습니다.",
            "TeamCloud 서비스 사용약관을 위반하는 행위를 할 경우 사용약관에 따라 불이익을 받으실 수 있습니다.",
            "아래 사용자 id는 사용자 데이터 변경 등 시스템에 필요하므로 따로 메모해두시길 바랍니다.",
            "[사용자 ID: " + User.edit(event.sender.name).id + "]"
        ].join("\n"));
        event.room.send(Coin(event.sender.name, "오픈기념", 30, false));
        //event.room.send("현재 나랑 친구할 수 없어..");
        User.save();
    }
}