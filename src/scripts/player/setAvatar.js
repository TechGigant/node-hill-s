const phin = require("phin")
    .defaults({"parse": "json", "timeout": 12000})

const GET_ASSETS =  "https://api.brick-hill.com/v1/games/retrieveAvatar?id="

function getNonEmptyHats(assets) {
    const hats = []

    for (let i = 0; i < 5; i++) {
        if (hats.length >= 3) break

        const hat = assets.hats[i]

        if (hat)
            hats.push(hat)
    }

    return hats
}

async function setAvatar(p, userId) {
    const data = (await phin({url: GET_ASSETS + userId})).body
    if (data.error) throw new Error(data.error.message)

    p.colors.head           = "#" + data.colors.head.toLowerCase()
    p.colors.torso          = "#" + data.colors.torso.toLowerCase()
    p.colors.leftArm        = "#" + data.colors.left_arm.toLowerCase()
    p.colors.rightArm       = "#" + data.colors.right_arm.toLowerCase()
    p.colors.leftLeg        = "#" + data.colors.left_leg.toLowerCase()
    p.colors.rightLeg       = "#" + data.colors.right_leg.toLowerCase()

    p.assets.tool           = data.items.tool
    p.assets.face           = data.items.face

    const hats = getNonEmptyHats(data.items)

    p.assets.hat1 = hats[0] || 0
    p.assets.hat2 = hats[1] || 0
    p.assets.hat3 = hats[2] || 0

    const clothing = data.items.clothing 
    if (clothing) {
        p.assets.clothing1 = clothing[0] || 0
        p.assets.clothing2 = clothing[1] || 0
        p.assets.clothing3 = clothing[2] || 0
        p.assets.clothing4 = clothing[3] || 0
        p.assets.clothing5 = clothing[4] || 0
    } else {
        p.assets.clothing1 = data.items.pants
        p.assets.clothing2 = data.items.shirt
        p.assets.clothing3 = data.items.tshirt
    }
    return true
}

module.exports = setAvatar