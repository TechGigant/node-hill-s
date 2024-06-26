const PacketBuilder = require("../../net/PacketBuilder").default

const filterModule = require("../../util/filter/filterModule").default

const chatModule = require("../../util/chat/chatModule").default

const Game = require("../../class/Game").default

const generateTitle = require("../../util/chat/generateTitle").default

const formatHex = require("../../util/color/formatHex").default

function clientMessageAll(p, message, titleGeneration) {
    if (!chatModule.validateMessage(p, message)) return

    console.log(`${p.username}: ${message}`)

    Game.emit("chatted", p, message)

    p.emit("chatted", message)

    let fullMessage = message

    if (titleGeneration) fullMessage = generateTitle(p, message)

    return new PacketBuilder("Chat")
        .write("string", fullMessage)
        .broadcastExcept(p.getBlockedPlayers())
}

function messageAll(message) {
    message = formatHex(message)

    return new PacketBuilder("Chat")
        .write("string", message)
        .broadcast()
}

function messageClient(socket, message) {
    message = formatHex(message)

    return new PacketBuilder("Chat")
        .write("string", message)
        .send(socket)
}

module.exports = { messageAll, messageClient, clientMessageAll }