Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let A = Bridge.getScopeOf("A");

let path = 'sdcard/BotData/check-in_list.json';

let line = '\u2501'.repeat(9);

if (!A.fs.read(path)) A.fs.write(path, '{}'); //만약 해당 경로에 파일이 없다면 파일 생성
let json = JSON.parse(A.fs.read(path)); //파일에 있는 데이터를 JSON형식으로 json변수에 대입

if (json['today'] == undefined) json['today'] = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate();
if (json['list'] == undefined) json['list'] = {};
if (json['store'] == undefined) json['store'] = {};


function onProjectButtonClicked(id) {
    if (id == "reset_tc") {
        Api.makeNoti("data reset", 'atten');
        json["list"]["TeamCloud 커뮤니티"] = [];
        A.fs.write(path, JSON.stringify(json, null, 4));
    }
}

function onMessage(event) {

    var room_list = [];
    if (event.message && room_list.includes(event.room.name) == false) room_list.push(event.room.name);


    let today = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate();


    if (json['today'] != today) { //만약 하루가 지났다면 초기화
        json['today'] = today;
        json['list'] = {};
        A.fs.write(path, JSON.stringify(json, null, 4));
    }

    if (json['list'][event.room.name] == undefined) json['list'][event.room.name] = [];
    if (json['store'][event.room.name] == undefined) json['store'][event.room.name] = {};

    if (event.message == A.prefix + "출석") {
        if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
        if (A.user.edit(event.sender.name).ban) return event.room.send(A.msg.noti + '나 너 싫어!');

        if (json['list'][event.room.name].includes(event.sender.name)) { //만약 출석목록에 이미 이름이 있는경우
            event.room.send([
                A.msg.noti,
                "출석체크✔️", ,
                A.Lw,
                "[" + "[" + A.user.edit(event.sender.name).nickname[0] + "]" + event.sender.name + "]" + A.Pos(event.sender.name, "아", "야") + ", 이미 출석을 했어"
            ].join('\n')); //출석체크
            return;
        } else { //없는 경우
            let rank = (Number(json['list'][event.room.name].length) + 1);
            event.room.send([
                A.msg.noti,
                "출석체크✔️",
                A.Lw,
                "[" + A.user.edit(event.sender.name).nickname[0] + "]" + event.sender.name + A.Pos(event.sender.name, "아", "야") + ", 출석체크 완료했어!",
                "► 오늘의 [" + "[" + A.user.edit(event.sender.name).nickname[0] + "]" + event.sender.name + "]의 순위: " + rank
            ].join("\n"));
            event.room.send(A.msg.coin(event.sender.name, "출석체크 완료", 5));
            json['list'][event.room.name].push(event.sender.name);
            if (json['store'][event.room.name][event.sender.name] == undefined) json['store'][event.room.name][event.sender.name] = {
                'today_ranking': 0,
                'first_count': 0,
                'count': 0,
                'achieve': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };
            json['store'][event.room.name][event.sender.name]['today_ranking'] = rank;
            json['store'][event.room.name][event.sender.name]['count']++;
            if (rank > 0 && rank <= 10) json['store'][event.room.name][event.sender.name]['achieve'][(rank - 1)]++;
            if (rank == 1) json['store'][event.room.name][event.sender.name]['first_count']++;
            if (rank == 1) A.msg.coin(event.sender.name, "출석체크 1등", 10);
            if (json['store'][event.room.name][event.sender.name]['first_count'] >= 50)
                if (!A.user.edit(event.sender.name).nickname.includes("출석왕!")) event.room.send(A.msg.nickname(event.sender.name, "출석 50회 이상 1등", "출석왕!"));
            if (json['store'][event.room.name][event.sender.name]['count'] >= 100)
                if (!A.user.edit(event.sender.name).nickname.includes("출석왕!!")) event.room.send(A.msg.nickname(event.sender.name, "출석 50회 이상 1등", "출석왕!!"));
            java.lang.Thread.sleep(1000);
            A.fs.write(path, JSON.stringify(json, null, 4));
            return;
        }
    }

    if (event.message == A.prefix + '출석순위') {
        if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
        if (A.user.edit(event.sender.name).ban) return event.room.send(A.msg.noti + '나 너 싫어!');

        if (json['list'][event.room.name] == undefined) {
            event.room.send([
                "출석순위✔️",
                A.Lw, ,
                "아직 아무도 출첵을 안했어!",
                "ㅊㅊ을 입력해 출석해봐!"
            ].join('\n'));
            return;
        }
        if (json['list'][event.room.name].length < 1) {
            event.room.send([
                "출석순위✔️",
                A.Lw, ,
                "아직 아무도 출첵을 안했어!",
                "ㅊㅊ을 입력해 출석해봐!"
            ].join('\n'));
            return;
        }
        event.room.send([
            "출석순위🏆",
            '[' + event.room.name + '] 의 출석순위이야',
            A.Lw, , ,
            json['list'][event.room.name].map(e => json['list'][event.room.name].indexOf(e) + 1 + '위ㅣ' + e).join('\n\n')
        ].join('\n'));
        return;
    }

    if (event.message == A.prefix + '내 출석') {
        if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
        if (A.user.edit(event.sender.name).ban) return event.room.send(A.msg.noti + '나 너 싫어!');

        if (json['store'][event.room.name][event.sender.name] == undefined) return event.room.send("내출석✔️\n" + Lw + '[' + "[" + A.user.edit(event.sender.name).nickname + "]" + event.sender.name + ']' + A.Pos(event.sender.name, "아", "야") + ', 넌 아직 출석을 한 적이 없어.');
        let myinfo = json['store'][event.room.name][event.sender.name];
        let list = [];
        for (i = 0; i < myinfo['achieve'].length; i++) list.push((i + 1) + '위 : ' + myinfo['achieve'][i] + '회');
        return event.room.send([
            "내 출석 현황✔️",
            '[' + "[" + A.user.edit(event.sender.name).nickname[0] + "]" + event.sender.name + '의 출석현황',
            A.Lw, ,
            line,
            '오늘순위 : ' + myinfo['today_ranking'],
            '누적 1등 횟수 : ' + myinfo['first_count'],
            '출석 횟수 : ' + myinfo['count'],
            line,
            list.join('\n')
        ].join('\n'));
    }
}

function onStartCompile() {
    A.fs.write(path, JSON.stringify(json, null, 4));
}