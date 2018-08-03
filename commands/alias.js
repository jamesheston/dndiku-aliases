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
        return Broadcast.sayAt(player, 'Not a valid alias command. See "help alias".')
      }
    }    
  }
}

function addAlias(userInputString, p) {
  let output = ''
  const aliases = validateMeta(p)
  // update aliases object with new entry
  const key = userInputString.match(rgxAddNew)[2]
  const value = userInputString.match(rgxAddNew)[3]
  aliases[key] = value

  p.setMeta('aliases', aliases) // write changes to player config file
  output = `You have added a new alias "${key}" for "${value}".` 
  return output
}
function checkAlias(userInputString, p) {
  let output = ''
  const aliases = validateMeta(p)

  // update aliases object with new entry
  const key = userInputString.match(rgxCheckSpecific)[1]
  const value = aliases[key]
    
  if( value ) {
    output = `{${key}} : {${value}}`
  } else {
    output = `You have no alias for "${key}".`
  }
  return output
}
function listAliases(userInputString, p) {
  let output = ''
  const aliases = validateMeta(p)

  // if a player has any aliases, iterate over them, echoing every single one
  if( Object.keys(aliases).length ) {
    for( var key in aliases ) {
      if( aliases.hasOwnProperty(key) ){
        const value = aliases[key]
        output+= `{${key}} : {${value}}\n`
      }
    }

  } else {
    output = 'You have no aliases set.'
  }

  return output
}
function deleteAlias(userInputString, p) {
  let output = ''
  const aliases = validateMeta(p)
  const key = userInputString.match(rgxDelete)[1]

  if( aliases[key] ){
    value = aliases[key]
    delete aliases[key]
    output = `You have deleted alias "${key}" for "${value}".`
  } else {
    output = `You have no alias set for "${key}". It is already clear.`
  }

  p.setMeta('aliases', aliases) // write changes to player config file
  return output
}

// Helper functions
//-----------------
function validateMeta(p) {
  let aliases = p.getMeta('aliases')
  if (!aliases) {
    aliases = {}
  } 

  // add more checks here later for other forms of bad data

  p.setMeta('aliases', aliases)
  return aliases
}