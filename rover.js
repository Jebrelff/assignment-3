class Rover {
   // Write code here!
   constructor(position) {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }

   receiveMessage(message) {
      let results = [];
      let commands = message.commands;

      for (let i = 0; i < commands.length; i++) {
         if (commands[i].commandType === 'STATUS_CHECK') {
            results.push({
               completed: true, 
               roverStatus: { 
                  mode: this.mode, 
                  generatorWatts: this.generatorWatts, 
                  position: this.position
               }
            });
         }
         else if (commands[i].commandType === 'MODE_CHANGE') {
            this.mode = commands[i].value;
            results.push({ completed: true });
         }
         else if (commands[i].commandType === 'MOVE') {
            if (this.mode === 'LOW_POWER') {
               results.push({ completed: false });
            }
            else {
               this.position = commands[i].value;
               results.push({ completed: true });
            }
         }
      }

      return { message: message.name, results: results };
   }
}

module.exports = Rover;