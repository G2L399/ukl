/** load library express */
const express = require(`express`);
/** create object that instances of express */
const app = express();
/** define port of server */
const PORT = 8000;
/** load library cors */
const cors = require(`cors`);
/** open CORS policy */
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require(`./Routes/auth.route.js`);
const coffee = require(`./Routes/coffee.route.js`);
const order = require(`./Routes/order.route.js`);

app.use(`/admin`, auth);
app.use(`/coffee`, coffee);
app.use(`/order`, order);
app.listen(PORT, () => {
    console.log(`Server of FlagShop runs on port ${PORT}
  http://localhost:${PORT}`);
  });
  