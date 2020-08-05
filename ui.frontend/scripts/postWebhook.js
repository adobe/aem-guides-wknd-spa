const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile('./dist/app.js', './../ui.server-side/actions/common/app.js', (err) => {
  if (err) throw err;
  console.log('Server Distribution was prepped for Runtime action');
});