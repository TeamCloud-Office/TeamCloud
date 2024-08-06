function onMessage(event) {

}

function onMessageDeleted(event) {
    if (event.room.name == "TeamCloud 개발방") {
        event.room.send("메시지가 삭제됨." + "\n" + "이름: " + event.sender + "\n" + "메시지: " + event.message)
    }
}