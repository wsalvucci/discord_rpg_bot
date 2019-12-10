require('./createAccount')
require('./createCharacter')
require('./travel')

const moveCharacter = require('./move')

const bot = require('../bot')

bot.on('message', msg => {
    if (msg.content.toLowerCase().substr(0, 6) === '??move') {
        moveCharacter(msg)
    }
})