import Game, { SetData } from "../class/Game"

let postedOnce = false

const phin = require("phin")
    .defaults({
        url: "https://sandpile.xyz/api/postServer",
        method: "POST",
        timeout: 12000
    })

interface PostData {
    host_key: string
    port: number
    players: string[] // Array of player validation tokens
}

interface SetResponse {
    set_id: number,
    banned_players: number[]
    error?: {
        message: string
    }
}

function checkForBannedUsers(bannedUsers: number[]) {
    for (const player of Game.players) {
        if (bannedUsers.includes(player.userId))
            player.kick("Banned from SandPile.")
    }
}

async function initializeSetData(setResponse: SetResponse) {
    try {
        const setData: SetData = await Game.getSetData(setResponse.set_id)
        Game.setData = setData
        console.log(`Posted to: https://www.sandpile.xyz/set/${setResponse.set_id} successfully.`)
        postedOnce = true
        Game.emit("setDataLoaded")
    } catch (err) {
        Game.emit("setDataLoaded", err)
    }
}

export default async function postServer(): Promise<SetResponse | null> {
    try {
        const postData: PostData = {
            "host_key": Game.serverSettings.hostKey,
            "port": Game.serverSettings.port,
            "players": Game.players.map(player => player.validationToken)
        }

        const response = await phin({ data: postData })

        try {
            const data: SetResponse = JSON.parse(response.body)
            if (data.error) {
                console.warn("Failure while posting to games page:", JSON.stringify(data.error.message || data))

                if (data.error.message === "You can only postServer once every minute") return

                return process.exit(0)
            } else {
                if (!postedOnce) initializeSetData(data)

                checkForBannedUsers(data.banned_players)

                return data
            }
        } catch (err) { } // It was successful (?)
    } catch (err) {
        console.warn("Error while posting to games page.")
        console.error(err.stack)
    }
}