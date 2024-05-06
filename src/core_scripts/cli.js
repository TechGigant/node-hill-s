/*eslint no-undef: "off"*/
const serverline = getModule('serverline')

serverline._fixConsole(console)

serverline.init()
serverline.setPrompt('cli> ')

async function lineHandler(line) {
    if (line === "clear")
        return console.clear()

    try {
        const data = await eval(`(async() => { return ${line} })()`)
        if (typeof data !== "undefined")
            console.log(data)
    } catch (err) {
        console.error(err)
    }
}

serverline.on('line', lineHandler)