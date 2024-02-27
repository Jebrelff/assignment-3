const Message = require('./message.js');
const Command = require('./command.js');
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
let rover = new Rover(100);
let commands = [
   new Command('MOVE', 4321),
   new Command('STATUS_CHECK'),
   new Command('MODE_CHANGE', 'LOW_POWER'),
   new Command('MOVE', 3579),
   new Command('STATUS_CHECK')
];
let message = new Message('TA power', commands);
    let response = rover.receiveMessage(message);
    console.log(response)
module.exports = Rover;