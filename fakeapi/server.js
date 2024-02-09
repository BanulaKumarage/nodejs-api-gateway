const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/fakeapi', (req,res,next) => {
    console.log('fakeapi called');
    res.send('Fake API\n');
})

app.listen(port, () => {
    console.log(`Fake API listening at http://localhost:${port}`);
});