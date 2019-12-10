const bot = require('../bot')
const query = require('../sqlQuery')

function moveCharacter(msg, userId, xDelta, yDelta) {
    query('SELECT l.* FROM user u INNER JOIN user_character uc ON u.user_id = uc.user_id INNER JOIN characters c ON uc.character_id = c.character_id INNER JOIN character_location cl ON c.character_id = cl.character_id INNER JOIN location l ON cl.location_id = l.location_id WHERE u.user_id = ?', [userId]).then(curLocation => {
        const newX = curLocation[0]['x'] + xDelta
        const newY = curLocation[0]['y'] + yDelta
        query('SELECT l.*, p.* FROM location l left join place p on p.place_id = l.place_id WHERE x = ? and y = ?',[newX, newY]).then(newLocation => {
            if (newLocation[0]['place_type_id'] === 10) {
                msg.reply('You can\'t go into the ocean!!').catch(err => console.error(err))
            } else if (newLocation[0]['place_type_id'] === 12) {
                msg.reply('You can\'t go over a mountain!!').catch(err => console.error(err))
            } else {
                query('UPDATE character_location cl INNER JOIN user_character uc ON cl.character_id = uc.character_id SET cl.location_id = ? WHERE uc.user_id = ?',[newLocation[0]['location_id'], userId]).then(data => {
                    console.log(data)
                }, err => {
                    console.log(err)
                })
            }
        }, err => {
            console.log(err)
        })
    }, err => {
        console.log(err) 
    })
}

module.exports = msg => {
    const msgParts = msg.content.split(' ')
    if (msgParts.length < 2) {
        msg.reply('You need to specify a valid direction! (N, S, E, W, NW, NE, SE, SW)').catch(err => console.error(err))
    } else {
        const direction = msgParts[1]
        var xDelta = 0
        var yDelta = 0
        switch (direction) {
            case 'N':
                yDelta = 1
                break
            case 'NW':
                yDelta = 1
                xDelta = -1
                break
            case 'NE':
                yDelta = 1
                xDelta = 1
                break
            case 'W':
                xDelta = -1
                break
            case 'E':
                xDelta = 1
                break
            case 'SW':
                yDelta = -1
                xDelta = -1
                break
            case 'S':
                yDelta = -1
                break
            case 'SE':
                yDelta = -1
                xDelta = 1
                break
            default:
                break
        }
        moveCharacter(msg, msg.author.id, xDelta, yDelta)
    }
}