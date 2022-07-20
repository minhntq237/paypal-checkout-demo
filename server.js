const data = require("./public/data.json")

require("dotenv").config()

const express = require("express")
const app = express()
const paypal = require("@paypal/checkout-server-sdk")

var path = require('path')
var cors = require('cors')

app.use(cors())
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())



const Environment = paypal.core.SandboxEnvironment

/* paypal.core.SandboxEnvironment
   paypal.core.LiveEnvironment */

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

const storeItems = new Map([[1, data["storeItem"]]])

app.get("/", (req, res) => { /* '/' auto get public folder */
  res.render("index", {
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
  })
})

app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity
  }, 0)
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.price,
            },
            quantity: item.quantity,
          }
        }),
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/on-success', (req, res) => {
  res.sendFile(path.resolve('./views/onSuccess.html'))
});

app.get('/on-cancel', (req, res) => {
  res.sendFile(path.resolve('./views/onCancel.html'))
});

app.post('/add', function(req,res) {
  console.log(req.body.name);
  res.json(req.body.name);
});

app.listen(3000, function (err) {
  if (err) {
    throw err;
  }
  console.log('express server running');
});
