const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
   const options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
         'x-timestamp': Date.now(),
         'x-sent': true,
      },
   };
   res.sendFile(path.join(__dirname, '..', 'public'), options);
});

app.get('/cars', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'cars.html'));
});

app.listen(port, () => {
   console.log(`Car Rental listening on port ${port}`);
});
