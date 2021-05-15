import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.mjs';
import { connectDb } from './models/index.mjs'

dotenv.config();
const bparser_form = express.json()
const app = express();

app.use(bparser_form)

app.use('/', routes);
app.get('*', (req, res) => res.status(200).send({
   message: 'There is nothing here',
 }));
 
connectDb().then(() => {
   let server = app.listen(process.env.SERVER_PORT || 8080, function () {
      let port = server.address().port
      console.log("Welcome to the server. Running in port %s", port)
   })
});

export default app;