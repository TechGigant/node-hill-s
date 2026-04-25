import Game, { SetData } from "../class/Game"
import * as https from "node:https"

let postedOnce = false

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

        const dataString = JSON.stringify(postData)

        const options = {
            hostname: 'sandpile.xyz',
            port: 443,
            path: '/api/postServer',
            method: 'POST',
            family: 4, // Force IPv4
            timeout: 12000,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            }
        }

        const responseData: string = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = ''
                res.on('data', d => body += d)
                res.on('end', () => resolve(body))
            })
            req.on('error', reject)
            req.on('timeout', () => {
                req.destroy()
                reject(new Error('Request timed out'))
            })
            req.write(dataString)
            req.end()
        })

        try {
            const data: SetResponse = JSON.parse(responseData)
            if (data.error) {
                console.warn("Failure while posting to games page:", JSON.stringify(data.error.message || data))

                if (data.error.message === "You can only postServer once every minute") return null

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
    return null
}