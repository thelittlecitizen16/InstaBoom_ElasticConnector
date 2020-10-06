import express = require('express');
const app: express.Application = express();
const port = 8000

app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



