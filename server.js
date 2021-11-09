const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const session = require('cookie-session');
const passport = require('./middleware/passport-setup');
const passports = require('./middleware/facebook-passport-setup');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database

// Routes files
const router = require('./routes/index');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Cookie parser
app.use(cookieParser());

//Cookies session
app.use(
  session({
    name: 'laptop-cookie',
    keys: ['secretAja', 'secretkedua'],
  })
);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(__dirname + '/files'));
app.use(express.static(path.join(__dirname, 'public')));

//google Auth and facebook auth
app.use(passport.initialize());
app.use(passports.initialize());
app.use(passport.session());

// Mount routers
app.use('/', router);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandeled promise rejections
process.on('unhandleRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
