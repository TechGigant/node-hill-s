const PacketBuilder = require("../../net/PacketBuilder").default

function deleteBricks(bricks) {
    const packet = new PacketBuilder("DeleteBrick")
        .write("uint32", bricks.length)

    for (const brick of bricks)
        packet.write("uint32", brick.netId)

    return packet
}

module.exports = deleteBricks