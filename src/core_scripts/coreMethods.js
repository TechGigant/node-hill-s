/*eslint no-undef: "off"*/
Game.coreScripts = Game.coreScripts || {}

export default class CoreScript {
    constructor(name) {
        this.name = name
        this.methods = {}
        this.events = []
        this.destroyed = false
        this.properties = {}
        Game.coreScripts[name] = this
    }
    destroy() {
        this.destroyed = true
        this.events.forEach((event) => event.disconnect())
    }
    newListener(object, name, callback) {
        object.on(name, callback)
        this.events.push({
            disconnect() { object.off(name, callback) }
        })
    }
}