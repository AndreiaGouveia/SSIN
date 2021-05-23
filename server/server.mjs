import express from 'express';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import routes from './routes/index.mjs';
import { connectDb } from './models/index.mjs';
import { ExpressPeerServer } from 'peer';

dotenv.config();

const options = {
   key: fs.readFileSync('./certs/localhost-key.pem'), // Replace with the path to your key
   cert: fs.readFileSync('./certs/localhost.pem') // Replace with the path to your certificate
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS (for local testing only -remove in production/deployment)
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
   next();
});

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', routes);

connectDb().then(() => {
   let server = https.createServer(options, app).listen(process.env.SERVER_PORT || 8080, function () {
      let port = server.address().port
      console.log("Welcome to the server. Running in port %s", port)
   });

   app.use('/peerjs', ExpressPeerServer(server, {
      debug: true,
      path: '/'
   }));

   app.get('*', (req, res) => res.status(200).send({
      message: 'There is nothing here',
   }));
});

export default app;
