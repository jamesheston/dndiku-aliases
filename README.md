# Ranvier Bundle - dndiku-aliases
Aliases for the legendary JavaScript MUD engine!


## How to Use
Right now, the alias system is very simple: just substring replacement and no regex support.


* __Add an alias__
  `alias t stand`

* __Check an alias__
  `alias t`

* __List all aliases__
  `aliases`

* __Remove an alias__
  `unalias t`





## How to Install

1. git clone bundle into your ranvier repo's bundles directory
  ```
  git clone 
  ```
2. add the another line to the "bundles" array in ranvier.json (delete comma if it's last entry in "bundles" array)
  ```
      "dndiku-aliases",
  ```
3. add the following line to src/Player.js in the constructor method
  ```
      this.aliases = new Map( JSON.parse(data.aliases) ) || new Map();
  ```
4. again in src/Player.js, add another line to the data object in Player.serialize() 
  ```
        aliases: JSON.stringify([...this.aliases]),
  ```
5. add the following lines toward the begining of src/CommandParser.js, after `const parts = data.split(' ');` and before `const command = parts.shift().toLowerCase();`
  ```
      // 1st arg is current target for potential alias key
      const _key = parts[0] 
      // if 1st arg is an alias, just replace that part with alias value
      if(  player.aliases.has(_key)  ){
        parts[0] = player.aliases.get(_key)
      }
  ```







aliases should be stored in player files as 1 big object with a bunch of 'string' keys, 

or NO, it shoudl be a map that uses Data object, like other bundles / player data maps