const bot = require('../bot')
const query = require('../sqlQuery')
const moment = require('moment')

bot.on('message', msg => {
    if (msg.content.toLowerCase() === '??createaccount') {
        query('SELECT * FROM user WHERE user_id = ?', [msg.author.id]).then(data => {
            if (data.length === 0) {
                query('INSERT INTO user (user_id, user_type_id, username, time_created) VALUES (?, ?, ?, ?)', [parseInt(msg.author.id), 3, msg.author.username, moment().unix()]).then(data => {
                    msg.reply('Account created!').catch(err => {console.log(err)})
                }, err => {
                    msg.reply('Error while creating account').catch(err => {console.log(err)})
                    console.error(err)
                })
            } else {
                msg.reply('Account already created!').catch(err => {console.error(err)})
            }
        }, err => {
            msg.reply('Error while creating account').catch(err => {console.error(err)})
            console.error(err)
        }).then(() => {
            msg.delete().catch(err => {
                if (err['code'] === 50003) {
                    console.log('Attempted to delete a message sent in DM Channel')
                } else {
                    console.error(err)
                }
            })
        })
    }
})