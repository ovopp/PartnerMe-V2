const app = require('./index.js')
require('events').EventEmitter.prototype._maxListeners = 0;
app.listen(3000, () => console.log(`Express server currently running on port ${3000}`));