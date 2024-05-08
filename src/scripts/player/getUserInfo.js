const phin = require("phin")
    .defaults({
        parse: "json",
        timeout: 12000 
    })

const API = "https://sandpile.xyz/api/getUserInfoById/"

async function getUserInfo(userId) {
    return (await phin({url: API + userId})).body
}

module.exports = getUserInfo