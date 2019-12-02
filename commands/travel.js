const Discord = require('discord.js')
const bot = require('../bot')
const query = require('../sqlQuery')
const moment = require('moment')

function getFastestPath(start, end) {
    query('SELECT * FROM location').then(data => {
        const locationData = data['data']

        
    })
}

bot.on('message', msg => {
    if (msg.content.toLowerCase().substr(0, 6) === '??travel') {
        const parts = msg.content.split(' ')
        if (parts.length < 3 || isNaN(parts[1]) || isNaN(parts[2])) {
            msg.reply('You have to give x and y coordinates for where you want to go!').catch(err => {console.error(err)})
        } else {
            query('SELECT * FROM location WHERE x = ? and y = ?',[parts[1], parts[2]]).then(data => {
                if (data.length === 0) {
                    msg.reply('Invalid location!').catch(err => {console.error(err)})
                } else {

                }
            })
        }
    }
})