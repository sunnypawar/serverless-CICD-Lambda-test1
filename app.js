const serverless = require('serverless-http');
//*****************************This is original  */
// const express = require('express'); 
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.get('/api/info', (req, res) => {
//   res.send({ application: 'Sunny_sample-app-dev-commit', version: '1.0' });
// });
// app.post('/api/v1/getback', (req, res) => {
//   res.send({ ...req.body });
// });
// app.listen(3000, () => console.log(`Listening on: 3000`));

//*****************************This is original-Ended  */

const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/api/info', (req, res) => {
  res.send({ application: 'Sunny_sample-app-2801', version: '1.0' });
});

module.exports.handler = serverless(app);
