const phin = require("phin").defaults({ parse: "json", timeout: 12000 })

const API = (userId) => `https://api.brick-hill.com/v1/user/${userId}/value`

async function getPlayerValue(userId) {
    const data = (await phin({url: API(userId)})).body
    if(data.error) {
        return {
            'user_id': userId,
            'value': 0,
            'direction': 0
        }
    } else {
        return data
    }
}

module.exports = getPlayerValue