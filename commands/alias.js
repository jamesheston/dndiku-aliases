/*

Pattern Design Decisions
------------------------
If you look at other iterable Player/Character properties like this.equipment 
or this.combatants, they have methods like Character.addCombatant(target) or 
Character.equip(item, slot).

I am intentionally not adding any methods to Player.js so that I can keep the 
bundle' s code mostly to itself. Instead, I'll just pass the player instance
object and whatever other data is needed into what are basically "reducer" 
functions for manipulating Player.aliases object.

However, these "reducers" don't return the modified object. Instead they return 
whatever confirmation or error message string needs to be Broadcast to the 
user. So the player objects are modified inside these "reducers" without being 
returned.

I am going to try to store Player.aliases as a Map() b/c that's more in 
the style of the rest of ranvier, but if I don't like that, I may just 
store them as an object, which is what I would have done in the first
place. 

NOTE: Now I'm pretty sure Maps rule. I really dig:

function mapToJson(map) {
    return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}


Commands to implement
---------------------
- /alias (.+) (.+)/        :add a new alias
- /aliases/                       :lists all aliases
- /unalias (.+)/                :delete an alias


Important Notes
---------------
-
-

*/

const rgxAddNew = /^(alias) (\w+) (.+)$/
const rgxCheckSpecific = /^(alias) (\w+)$/
const rgxListAll = /^aliases$/
const rgxDelete = /^unalias (\w+)$/

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require( srcPath + 'Broadcast' )
  const CommandManager = require( srcPath + 'CommandManager')
  const Parser = require(  srcPath + 'CommandParser'  ).CommandParser

  return {
    aliases: [ 'alias', 'unalias', 'aliases' ],
    usage: 'alias <key> <command>, alias <key>, unalias <key>, aliases',
    command: state => (args, player, arg0) => {

      const userInputString = arg0 + ' ' + args
      const s = userInputString.trim()
      let command = '' 
      let operation = ''

      if (  rgxAddNew.test(s)  ) {
        Broadcast.sayAt(player, addAlias( s, player ))

      } else if (  rgxCheckSpecific.test(s)  ) {
        Broadcast.sayAt(player, checkAlias( s, player ))

      } else if (  rgxListAll.test(s)  ) {
        Broadcast.sayAt(player, listAliases(s, player))

      } else if (  rgxDelete.test(s)  ) {
        Broadcast.sayAt(player, deleteAlias(s, player))
        
      } else {
        return Broadcast.sayAt(player, "Not a valid alias command. See '<b>help alias</b>'.")
      }


    }    
  }
}

function addAlias(userInputString, player) {
  let output = ''
  // update aliases object with new entry
  const key = userInputString.match(rgxAddNew)[2]
  const value = userInputString.match(rgxAddNew)[3]

  if(! player.aliases ) {
    player.aliases = new Map()
  } 
  player.aliases.set(key, value)
  output = `You have added a new alias "${key}" for "${value}".` 

  return output
}
function checkAlias(userInputString, player) {
  let output = ''
  // update aliases object with new entry
  const key = userInputString.match(rgxCheckSpecific)[1]
  const value = player.aliases.get(key)

  if( value ) {
    output = `{${key}} : {${value}}`
  } else {
    output = `You have no alias for "${key}".`
  }

  return output
}
function listAliases(userInputString, player) {
  let output = ''
  // if a player has any aliases, iterate over them, echoing every single one
  if( player.aliases.size ) {
    for (const [key, value] of player.aliases) {
      output +=  `{${key}} : {${value}}\n`
    }

  } else {
    output = 'You have no aliases set.'
  }

  return output
}
function deleteAlias(userInputString, player) {
  let output = ''
  const key = userInputString.match(rgxDelete)[1]

  if( player.aliases.get(key) ) {
    player.aliases.delete(key)
    output = `You have deleted alias "${key}" for "${value}".`
  } else {
    output = `You have no alias set for "${key}". It is already clear.`
  }

  return output
}
