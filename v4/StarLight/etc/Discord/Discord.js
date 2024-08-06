let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    AP,
    Kakaocord,
    User,
    LS,
    msg,
    Pos,
    chat,
    post,
    random,
    Coin,
    Nickname,
    CoinA,
    NicknameA,
    Like,
    ogimg
} = require("Basic");


let admin_list = ["790731882128080987", "838932585119350786"]


function onMessage(event) {

    if (event.message.startsWith("discord eval.")) {
        if (admin_list.includes(String(event.sender.id))) {
            event.room.send("Discord Eval Result\n>" + eval(event.message.substr(14)))
        } else {
            event.room.send("Discord Eval Result\n> false")
        }
    }
    if (event.message.startsWith("discord id")) {
        event.room.send(String(event.sender.id));
    }

}