Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let tem = '';

function onMessage(event) {
    if (event.message.startsWith('/')) {
        tem = 'co';
    }
    if (event.sender.name == '방장봇' || event.sender.name == '오픈채팅봇') {
        if (tem == 'co') {
            tem = '';
        } else {
            if (event.room.name == 'TeamCloud 커뮤니티' && event.message.includes('Hello')) {
                event.room.send([
                    '👋',
                    '𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',,
                    '공지(규정)을 꼭 읽어주세요!',
                    '━━━━━━━━━',
                    "   <기본 안내사항>",
                    "▷ 커뮤니티에 접속한 모든 사용자분들은 규칙을 반드시 지켜야합니다.",
                    "▷ 팀클라우드 커뮤니티 이용규칙을 동의하지 않는 경우 팀클라우드 커뮤니티에 입장하실 수 없습니다.",
                    "▷ 만약 본 이용규칙을 위반하는 경우 관리자는 “팀클라우드 커뮤니티 이용규칙”에 의거하여 경고 없이 채팅을 가리거나, 이용제한, 영구퇴장 등의 조치를 취할 수 있습니다.",
                    "▷ 이용규칙을 숙지하지 않아 발생한 피해는 모두 사용자가 책임져야 하며, 팀클라우드 측에서는 책임지지 않습니다."
                ].join('\n'));
                tem = '';
            }
            if (event.room.name == 'Little women' && event.message.includes('환영합니다')) {
                event.room.send([
                    '👋',
                    'W E L C O M E',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',,
                    '공지(규정)을 꼭 읽어주세요!'
                ].join('\n'));
                tem = '';
            }
        }
    }
}