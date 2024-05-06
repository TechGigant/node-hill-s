/*eslint no-undef: "off"*/
const CoreScript = require("./coreMethods").default

const cs = new CoreScript("respawn")

cs.properties = {
    fallHeight: -150, // How far the player can fall below the baseplate
    respawnTime: 5
}

cs.newListener(Game, "playerJoin", (p) => {
    cs.newListener(p, "died", async () => {
        for (let i = 0; i < cs.properties.respawnTime; i++) {
            p.topPrint(`You will respawn in ${cs.properties.respawnTime - i} seconds.`)
            await sleep(1000)
        }
        return p.respawn()
    })
    const fallLoop = p.setInterval(() => {
        if (cs.destroyed) return clearInterval(fallLoop)

        if (p.alive && p.position.z <= cs.properties.fallHeight) {
            return p.kill()
        }
    }, 1000)
})