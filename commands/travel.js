const Discord = require('discord.js')
const bot = require('../bot')
const query = require('../sqlQuery')
const moment = require('moment')

function checkPathLength(path) {
    var length = 0
    path.forEach(location => {
        var addToPath = 0
        switch(location['place_type_id']) {
            //Cities and Towns
            case (1):
            case (2):
                addToPath = 0
                break
            //Roads
            case (9):
                addToPath = 0.5
                break
            //Rivers
            case (11):
                addToPath = 2
                break
            case (12):
                addToPath = 5
            default:
                addToPath = 1
        }
    });
    return length
}

function checkPaths(paths, amd, end) {
    var endFound = false
    var shortestPath = null
    paths.forEach(path => {
        if (path[path.length - 1]['location_id'] === end['location_id']) {
            if (checkPathLength(path) < shortestPath) {
                endFound = true
                shortestPath = path
            }
        }
    });

    if (endFound) {
        paths.forEach(path, index => {
            if (checkPathLength(path) > checkPathLength(shortestPath) + amd) {
                paths.splice(index, 1)
            }
        })
    }

    allPathsTerminate = true
    paths.forEach(path => {
        if (path[path.length - 1]['location_id'] !== end['location_id']) {
            allPathsTerminate = false
        }
    });

    if (allPathsTerminate) {
        return shortestPath
    } else {
        return null
    }
}

function getFastestPath(start, end) {
    query('select * from location l left join place p on p.place_id = l.place_id').then(data => {
        const locations = data['data']

        paths = [
            [
                {'location_id': start['location_id'], 'place_type_id': start['place_type_id'], 'x': start['x'], 'y': start['y']}
            ]
        ]

        viablePath = checkPaths(paths, Math.max(Math.abs(start['x'] - end['x']), Math.abs(start['y'] - end['y'])), end)

        if (viablePath !== null) {
            return viablePath
        } else {
            paths.sort(function(a,b) {
                return checkPathLength(a) - checkPathLength(b)
            })
            //Add the new paths
        }
    })
}

bot.on('message', msg => {
    if (msg.content.toLowerCase().substr(0, 8) === '??travel') {
        const parts = msg.content.split(' ')
        if (parts.length < 3 || isNaN(parts[1]) || isNaN(parts[2])) {
            msg.reply('You have to give x and y coordinates for where you want to go!').catch(err => {console.error(err)})
        } else {
            query('SELECT * FROM location l left join place p on p.place_id = l.place_id WHERE x = ? and y = ?',[parts[1], parts[2]]).then(locationData => {
                if (locationData.length === 0) {
                    msg.reply('Invalid location!').catch(err => {console.error(err)})
                } else {
                    query('SELECT uc.user_id, c.character_id, l.*, p.place_type_id from characters c inner join character_location cl on c.character_id = cl.character_id inner join location l on cl.location_id = l.location_id inner join user_character uc on c.character_id = uc.character_id left join place p on p.place_id = l.place_id where uc.user_id = ?',[msg.author.id]).then(characterLocationData => {
                        if (characterLocationData.length > 0) {
                            //send target location and character location to method
                            getFastestPath(characterLocationData[0], locationData[0])
                        } else {
                            msg.reply('Invalid current character location!').catch(err => {console.error(err)})
                        }
                    })
                }
            })
        }
    }
})