const Discord = require('discord.js')
const bot = require('../bot')
const query = require('../sqlQuery')
const moment = require('moment')

//Use this to customizing starting attributes for different classes
function startingAttributeLevel(attribute_id, class_id) {
    
}

function createNewCharacter(msg, user_id, character_class, character_name) {
    query('INSERT INTO characters (character_type_id, name, alive, level, xp, money) VALUES (?, ?, ?, ?, ?, ?)',[1,character_name, true, 1, 0, 0]).then(data => {
        var character_id = data.insertId
        query('INSERT INTO user_character (user_id, character_id, time_created) VALUES (?, ?, ?)',[user_id, character_id, moment().unix()]).then(data => {
            query('INSERT INTO character_class (character_id, class_id) VALUES (?, ?)', [character_id, character_class]).then(data => {
                query('INSERT INTO character_location (character_id, location_id) VALUES (?, ?)', [character_id, 418040]).then(data => {
                    //Add attributes based on class chosen
                    for (var i = 1; i <= 14; i++) {
                        query('INSERT INTO character_attribute (character_id, attribute_id, value) VALUES (?, ?, ?)',[character_id, i, 1]).then(data => {

                        }, err => {
                            msg.reply('Error creating character (character attributes not added) \n ' + err).catch(err => {console.error(err)})
                        })
                    }
                }, err => {
                    msg.reply('Error creating character (character location not added) \n ' + err).catch(err => {console.error(err)})
                })
            }, err => {
                msg.reply('Error creating character (character class not added) \n ' + err).catch(err => {console.error(err)})
            })
        }, err => {
            msg.reply('Error creating character (character not added to user) \n ' + err).catch(err => {console.error(err)})
        })
    }, err => {
        console.error(err)
        msg.channel.send('Error creating character (character not added) \n ' + err).catch(err => console.error(err))
    })
}

bot.on('message', msg => {
    if (msg.content.toLowerCase() === '??createcharacter') {
        query('SELECT * FROM user WHERE user_id = ?', [msg.author.id]).then(data => {
            if (data.length !== 0) {
                query('SELECT * FROM user_character WHERE user_id = ?', [msg.author.id]).then(data => {
                    if (data.length > 0) {
                        msg.reply('You cannot have more than one character at this time').catch(err => {console.error(err)})
                    } else {
                        var classesEmbed = new Discord.RichEmbed()
                        classesEmbed.addField('1', 'Soldier', true)
                        classesEmbed.addField('2', 'Mage', true)
                        classesEmbed.addField('3', 'Ranger', true)
                        classesEmbed.addField('4', 'Priest', true)
                        msg.channel.send(classesEmbed)
                        var classResponseFilter = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 15000})
                        classResponseFilter.on('end', clasCol => {
                            var chosenClass = clasCol.first().content
                            if (isNaN(parseInt(chosenClass)) || chosenClass <= 0 || chosenClass > 4) {
                                msg.channel.send('Not a valid class number').catch(err => {console.error(err)})
                            } else {
                                msg.channel.send('Give your new character a name! (At least 3 characters long)')
                                var nameResponseFilter = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 30000})
                                nameResponseFilter.on('end', nameCol => {
                                    var chosenName = nameCol.first().content
                                    msg.reply('Making a character of class ' + chosenClass + ' with name ' + chosenName).catch(err => {console.error(err)})
                                    createNewCharacter(msg, msg.author.id, chosenClass, chosenName)
                                })
                            }
                        })
                    }
                })
            } else {
                msg.reply('You dont have an account!').catch(err => {console.error(err)})
            }
        }, err => {
            msg.reply('Error while creating character')
        })
    }
})