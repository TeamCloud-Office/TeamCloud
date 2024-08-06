let tem = '';

function onMessage(event) {
    if (event.message.startsWith('/')) {
        tem = 'co';
    }
    if (event.sender.name == '방장봇' || event.sender.name == '오픈채팅봇') {
        if (tem == 'co') {
            tem = '';
        } else {
            if (event.room.name == 'TeamCloud 커뮤니티') {
                event.room.send([
                    '👋',
                    '𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',
                    "",
                    '공지(규정)을 꼭 읽어주세요!'
                ].join('\n'));
                tem = '';
            }
            if (event.room.name == 'Little women' && event.message.includes('환영합니다')) {
                event.room.send([
                    '👋',
                    'W E L C O M E',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',
                    "",
                    '공지을 꼭 읽어주세요!'
                ].join('\n'));
                tem = '';
            }
            if (event.room.name == '미성년자 금융방' && event.message.includes('안녕하세요')) {
                event.room.send([
                    '👋',
                    'W E L C O M E',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',
                    "",
                    '📢안녕하세요! 공지 확인 부탁드립니다~'
                ].join('\n'));
                tem = '';
            }
            if (event.room.name == '♡ 78 마굿간 ♡' && event.message.includes('어서와')) {
                event.room.send([
                    '👋',
                    'W E L C O M E',
                    '━━━━━━━━━━━━━━━━',
                    event.room.name + '에 오신걸 환영해요!',
                    "",
                    '공지을 꼭 읽어주세요!'
                ].join('\n'));
                tem = '';
            }
        }
    }
}