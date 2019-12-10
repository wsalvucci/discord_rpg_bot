require('./createAccount')
require('./createCharacter')
require('./travel')

const moveCharacter = require('./move')
const createAccount = require('./createAccount')
const createCharacter = require('./createCharacter')

const bot = require('../bot')

bot.on('message', msg => {
    if (msg.content.toLowerCase().substr(0, 6) === '??move') {
        moveCharacter(msg)
    }
    if (msg.content.toLowerCase() === '??createaccount') {
        createAccount(msg)
    }
    if (msg.content.toLowerCase() === '??createcharacter') {
        createCharacter(msg)
    }
})