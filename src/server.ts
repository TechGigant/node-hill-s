// Import dependencies
import net from "net"
import Game from "./class/Game"
import { ClientSocket } from "./class/Player"

// Post server
import postServer from "./api/postServer"

// Connection + packet handler
import parsePacket from "./net/packetHandler"
import Sanction from "./class/Sanction"

// Create socket server.
const SERVER = net.createServer(socketConnection)

function maskIP(ip: string): string {
    const twoOctets = ip.split(".").splice(0, 2)
    return twoOctets.join(".") + ".x.x"
}

async function socketConnection(client: ClientSocket) {
    client._chunk = {
        recieve: Buffer.alloc(0),
        remaining: 0,
        clear: function () {
            this.recieve = Buffer.alloc(0)
            this.remaining = 0
        }
    }

    client.IPV4 = client.remoteAddress

    if (Sanction.bannedIPs.has(client.IPV4))
        return client.destroy()

    client.IP = maskIP(client.IPV4)
    client._attemptedAuthentication = false

    console.log(`<New client: ${client.IP}>`)

    client.setNoDelay(true)

    Game.emit("socketConnection", client)

    client.once("close", async () => {
        console.log(`<Client: ${client.IP}> Lost connection.`)
        if (client.player) {
            await Game._playerLeft(client.player)
                .catch(console.error)
        }
        return !client.destroyed && client.destroy()
    })

    client.on("error", () => {
        return !client.destroyed && client.destroy()
    })

    client.keepalive = {
        timer: null,

        keepAliveTime: 30000,

        kickIdlePlayer: function () {
            if (client.player && !client.destroyed)
                return client.player.kick('Lack of connectivity.')
        },

        restartTimer: function () {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(this.kickIdlePlayer, this.keepAliveTime)
        }
    }

    client.on("data", (PACKET) => {
        client._chunk.recieve = Buffer.concat([
            client._chunk.recieve,
            PACKET
        ])
        parsePacket(client, PACKET)
            .catch(console.error)
    })

    // If the player fails to authenticate after 15 seconds.
    setTimeout(() => { return !client.player && client.destroy() }, 15000)
}

const settings = Game.serverSettings

const SERVER_LISTEN_ADDRESS = settings.ip || ((!settings.local && "0.0.0.0") || "127.0.0.1")

SERVER.listen(settings.port, SERVER_LISTEN_ADDRESS, async () => {
    console.log(`Listening on port: ${settings.port}.`)

    if (settings.local) return console.log("Running server locally.")
    if (!settings.postServer) return

    await postServer()

    setInterval(postServer, 60000)
})

Game.server = SERVER

process.on("uncaughtException", (err) => {
    console.error("Asynchronous error caught: \n", err)
})