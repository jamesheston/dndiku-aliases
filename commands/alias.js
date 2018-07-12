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
        Broadcast.sayAt(player, addAlias(s, player))

      } else if (  rgxCheckSpecific.test(s)  ) {
        Broadcast.sayAt(player, checkAlias(s, player))

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

function addAlias(userInputString, p) {
  let output = ''
  // update aliases object with new entry
  const key = userInputString.match(rgxAddNew)[2]
  const value = userInputString.match(rgxAddNew)[3]

  if(! p.getMeta('aliases')) {
    p.setMeta(  'aliases', new Map()  )
  }

  p.metadata.aliases.set(key, value)
  output = `You have added a new alias "${key}" for "${value}".` 

  return output
}
function checkAlias(userInputString, p) {
  let output = ''
  // update aliases object with new entry
  const key = userInputString.match(rgxCheckSpecific)[1]
 
  if(! getMeta('aliases') ) {
    output = 'You have no aliases defined.'
    return output
  }

  const value = p.metadata.aliases.get(key)

  if( value ) {
    output = `{${key}} : {${value}}`
  } else {
    output = `You have no alias for "${key}".`
  }

  return output
}
function listAliases(userInputString, p) {
  let output = ''
  // if a player has any aliases, iterate over them, echoing every single one
  if( p.getMeta('aliases') && p.metadata.aliases.size ) {
    for (const [key, value] of p.metadata.aliases) {
      output +=  `{${key}} : {${value}}\n`
    }

  } else {
    output = 'You have no aliases set.'
  }

  return output
}
function deleteAlias(userInputString, p) {
  let output = ''
  const key = userInputString.match(rgxDelete)[1]

  if( p.getMeta('aliases') && p.metadata.aliases.get(key) ) {
    p.metadata.aliases.delete(key)
    output = `You have deleted alias "${key}" for "${value}".`
  } else {
    output = `You have no alias set for "${key}". It is already clear.`
  }

  return output
}
