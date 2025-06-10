const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED Exception!💥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exit(1);
});
// LOAD ENV VARIABLES FROM CONFIG.ENV

dotenv.config({ path: './Config.env' });

// CHECK IF DATABASE IS LOADED
if (!process.env.DATABASE || !process.env.PASSWORD) {
  console.error('DATABASE_URL OR DATABASE_PASSWORD IS MISSING IN THE .ENV');
  process.exit(1);
}

// SETUP MONGOOSE CONNECTION
const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);

mongoose.connect(DB).then(() => console.log('DATABASE Connected'));

// REQUIRING APPLICATION
const app = require('./app');

// PORT FOR SERVER
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`APP RUNNING ON PORT: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!💥 SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
