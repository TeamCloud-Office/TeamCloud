Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let mentions = {};
let nicknames = [];
let Lw = '\u200b'.repeat(500);

function onMessage(event) {
    if (!nicknames.includes(event.sender.name))
        nicknames.push(event.sender.name);

    if ((Object.keys(mentions).includes(event.sender.name)) && (!["노란콩대화 자동응답기 공동체", "카카오톡봇 RPG Maker 공식방 (코드:1345z)"].includes(event.room.name))) {
        let contents = mentions[event.sender.name]
        .map((e, v) => {
            return [
                e.sender + '의 메시지 | ' + Math.floor((Date.now() - e.time) / 1000) + '초 전',
                '→ ' + e.content
            ].join('\n');
        });

        event.room.send([
            event.sender.name + '야! ' + contents.length + '개의 알림이 있어!',
            '전체보기를 눌러 확인해줘!',
            Lw,
            contents.join('\n\n')
        ].join('\n'));

        delete mentions[event.sender.name];
    }

    if ((/@.+/.test(event.message)) && (!["노란콩대화 자동응답기 공동체", "카카오톡봇 RPG Maker 공식방 (코드:1345z)"].includes(event.room.name))) {
        let users = nicknames.filter(e => event.message.includes('@' + e + ' '));
        if (users.length === 0) return;

        let mention = {
            sender: event.sender.name,
            time: Date.now(),
            content: event.message
        };

        users.forEach(e => {
            if (e in mentions) {
                mentions[e].push(mention);
            } else {
                mentions[e] = [mention];
            }
        });
        event.room.send([
            event.sender.name + '가 ' + users.join(', ') + ' 를/을 멘션!',
            '→ ' + users.join(', ') + '가 오면 전달해줄게!'
        ].join('\n'));
    }
}