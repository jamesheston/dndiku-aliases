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
You will have to edit a file in the `/src` directory as well as installing the bundle.

#### 1. Clone repo into your ranvier/bundles directory
```
git clone https://github.com/jamesheston/dndiku-aliases.git
```

#### 2. Edit `/ranvier.json` to enable aliases bundle
Add this line to the "bundles" array in ranvier.json. Make sure to delete the comma if it's last entry in "bundles" array.
```
    "dndiku-aliases",
```

#### 3. Edit `src/CommandParser.js` to replace user input with alias values they specified
Add the following lines toward the beginning of src/CommandParser.js, after `static parse(state, data, player) {` and before `if (!command.length) {`
```
    data = data.trim();

    let parts = data.split(' ');    

    // 1st arg is current target for potential alias key
    const _key = parts[0] 

    // if 1st arg is an alias, just replace that part with alias value
    if(  player.metadata.aliases && player.metadata.aliases.hasOwnProperty(_key)  ){

      const _val = player.metadata.aliases[_key]
      // remove original first argument from parts
      parts.shift()
      // prepend exploded replacement to original parts
      parts = _val.split(' ').concat(parts)
    }

    const command = parts.shift().toLowerCase();
```

## Thanks
Thanks to seanohue, khyldes, and marcelo for testing the bundle or telling me how to improve it.