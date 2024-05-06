import Player from "../../class/Player"
import Game from "../../class/Game"

import filterModule from "../filter/filterModule"
import generateTitle from "./generateTitle"

const COLOR_TAG_REGEX = new RegExp("(<color:[0-9]{6}>)|(\\c[0-9]{1})", "g")

const MAX_CHAT_LENGTH = 84
const MAX_COLOR_TAGS = 5

const rateLimit = new Set()

function getColorTagCount(input: string) {
    return input.match(COLOR_TAG_REGEX)?.length || 0
}

function removeColorTags(input: string) {
    return input.replace(COLOR_TAG_REGEX, "")
}

function validateMessage(p: Player, message: string): boolean {
    // Player is rate-limited
    if (rateLimit.has(p.userId)) {
        p.message("You're chatting too fast!")
        return false
    }

    // Add player to rate-limit
    rateLimit.add(p.userId)
    setTimeout(() => rateLimit.delete(p.userId), Game.chatSettings.rateLimit)

    // Player is muted
    if (p.muted) {
        p.message("You are muted.")
        return false
    }

    // Player used a swear
    if (filterModule.isSwear(message)) {
        p.message("Don't swear! Your message has not been sent.")
        return false
    }

    const tagCount = getColorTagCount(message)

    const messageLengthWithoutTags = message.length - (tagCount * 14)

    // No message
    if (!messageLengthWithoutTags) {
        p.message("Chat message cannot be empty.")
        return false
    }

    // Player is using too many color tags
    if (tagCount > MAX_COLOR_TAGS) {
        p.message("You can only use 5 or less color tags!")
        return false
    }

    // Message is too long
    if (messageLengthWithoutTags > MAX_CHAT_LENGTH) {
        p.message("Message is too long.")
        return false
    }

    return true
}

export default { generateTitle, validateMessage, removeColorTags }