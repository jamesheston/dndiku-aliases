# Ranvier MUD Engine Bundle - dndiku-aliases
Alias support for the legendary JavaScript MUD engine!


## How to Use
Right now, the alias system is very simple: just plain substring replacement - no regexes.


#### Add an alias
`alias t stand`

#### Check an alias
`alias t`

#### List all aliases
`aliases`

#### Remove an alias
`unalias t`





## How to Install
You will have to edit couple files in the `/src` directory as well as installing the bundle. 

#### 1. Clone repo into your ranvier/bundles directory
```
git clone 
```

#### 2. Edit `/ranvier.json` to enable aliases bundle
Add this line to the "bundles" array in ranvier.json. Make sure to delete the comma if it's last entry in "bundles" array.
```
    "dndiku-aliases",
```

#### 3. Edit `/src/Player.js` to load previously defined aliases 
Add the following line to src/Player.js in the constructor method
```
    if( data.aliases ) {
      this.aliases = new Map( JSON.parse(data.aliases) )
    } else {
      this.aliases = new Map()
    }
```

#### 4. Edit `/src/Player.js` to save aliases between sessions 
Again in src/Player.js, add a new line to the data object in Player.serialize() 
```
      aliases: JSON.stringify([...this.aliases]),
```

#### 5. Edit `src/CommandParser.js` to replace user input with alias values they specified
Add the following lines toward the beginning of src/CommandParser.js, after `const parts = data.split(' ');` and before `const command = parts.shift().toLowerCase();`
```
    // 1st arg is current target for potential alias key
    const _key = parts[0] 
    // if 1st arg is an alias, just replace that part with alias value
    if(  player.aliases.has(_key)  ){
      const _val = player.aliases.get(_key)
      // remove original first argument from parts
      parts.shift()
      // prepend exploded replacement to original parts
      parts = _val.split(' ').concat(parts)
    }
```