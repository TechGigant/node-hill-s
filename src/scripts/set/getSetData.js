const phin = require("phin")
    .defaults({ parse: "json", timeout: 12000 })

const API = "https://api.brick-hill.com/v1/sets/"

async function getSetData(setId) {
    const setData = (await phin({url: API + parseInt(setId)})).body
    return setData.data
}

module.exports = getSetData