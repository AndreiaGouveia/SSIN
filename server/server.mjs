import express from 'express';
import routes from './routes/index.mjs';

const bparser_form = express.json()
const app = express();

app.use(bparser_form)

app.use('/', routes);
app.get('*', (req, res) => res.status(200).send({
   message: 'There is nothing here',
 }));
 

let server = app.listen(8081, function () {
   let port = server.address().port
   
   console.log("Welcome to the server. Running in port %s", port)
})

export default app;