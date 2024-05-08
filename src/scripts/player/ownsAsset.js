const phin = require("phin")
    .defaults({ parse: "json", timeout: 12000 })

const API = (userId, itemId) => `https://sandpile.xyz/api/userOwnsItem?userId=${userId}&itemId=${itemId}`

async function playerOwnsAsset(userId, itemId) {
    return (await phin({url: API(userId, itemId)})).body?.owns
}

module.exports = playerOwnsAsset
