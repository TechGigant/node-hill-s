/*eslint no-undef: "off"*/
const CoreScript = require("./coreMethods").default

const cs = new CoreScript("chatUtils")

const e = (f) => cs.events.push(f)

const regexMatch = /(?:"([^"]+)"+)([^"]+)?/

const COMMAND_HELP = {
    "/cmds": "Displays all core chat commands.",
    "/w \"player\" message": "Whispers to a player privately. Quotes are required for usernames with spaces.",
    "/block player": "Blocks / unblocks a player's messages."
}

function findPlayerByName(name) {
    name = name.toLowerCase()
    return Game.players.find(p => p.username.toLowerCase() === name)
}

e(Game.command("block", (player, args) => {
    if (!args)
        return player.message("Must provide a player name.")

    const target = findPlayerByName(args)

    // No target found
    if (!target)
        return player.message("Invalid user: " + args)

    // Cannot block yourself
    if (target === player)
        return player.message("You cannot block yourself.")

    if (!player.blockedUsers.includes(target.userId)) {
        player.blockedUsers.push(target.userId)
        player.message("Successfully blocked: " + target.username)
    } else {
        player.blockedUsers.splice(target.username, 1)
        player.message("Successfully unblocked: " + target.username)
    }
}))

e(Game.command("cmds", (player) => {
    for (const key of Object.keys(COMMAND_HELP)) {
        player.message(key + ` (${COMMAND_HELP[key]})`)
    }
}))

e(Game.commands(["whisper", "w"], (player, args) => {
    if (!args)
        return player.message("Incorrect usage of command.")

    try {
        const match = args.match(regexMatch)
        let playerArg, message

        // User included quotes, EX: /w "brick hill" you suck
        if (match) {
            playerArg = match[1]
            message = match[2]
        } else {
            args = args.split(" ")
            playerArg = args.shift()
            message = args.join(" ")
        }

        message = message.trim()

        if (!message || !playerArg) throw new Error("Bad arguments.")

        message = util.chat.removeColorTags(message)

        if (!util.chat.validateMessage(player, message)) return

        const target = findPlayerByName(playerArg)

        if (target) {
            // You can't whisper to yourself.
            if (target === player)
                return player.message("You cannot whisper to yourself.")

            player.message(`[#ADFF2F][you -> ${target.username}]: ` + message)

            // You are blocked by this user.
            if (target.blockedUsers.includes(player.username))
                return

            target.message(`[#ADFF2F][${player.username} -> you]: ` + message)
        } else {
            player.message("Invalid user: " + playerArg)
        }
    } catch (err) {
        player.message("Failure while whispering.")
    }
}))

cs.newListener(Game, "initialSpawn", (p) => {
    p.message("Type /cmds for a list of commands.")
})