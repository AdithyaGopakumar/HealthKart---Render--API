let express = require("express");
let app = express();
let dotenv = require("dotenv");
dotenv.config();
let port = 9800;
// let port = process.env.PORT;
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let cors = require("cors");
// live mongo
let mongoUrl =
  "mongodb+srv://test:test123@cluster0.prgajkd.mongodb.net/?retryWrites=true&w=majority";
// local mongo
// let mongoUrl = "mongodb://127.0.0.1:27017";
// let mongoUrl = process.env.MongoURL;

let bodyParser = require("body-parser");
let db;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// connection with database
MongoClient.connect(mongoUrl, (err, client) => {
  if (err) console.log("Error while connecting");
  // live mongo
  db = client.db("HealthKart-data");
  // local mongo
  // db = client.db("healthKart");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// ********* fetching the apis **********

app.get("/", (req, res) => {
  res.send("hai from express");
});

// ############### API for HOME PAGE #################//
//*** Flash sale ***/
app.get("/allproducts/flashsale", (req, res) => {
  db.collection("products")
    .find()
    .limit(12)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//*** Trending Now ***/
app.get("/allproducts/trending", (req, res) => {
  db.collection("products")
    .find()
    .skip(12)
    .limit(12)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//*** Trending in whey supplements ***/
app.get("/allproducts/trendingwhey", (req, res) => {
  db.collection("products")
    .find({ category_id: 1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//*** gaining supllements ***/
app.get("/allproducts/gainers", (req, res) => {
  db.collection("products")
    .find({ category_id: 2 })
    .limit(12)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// ############### OTHER APIS #################//

//*** BRAND api || CATEGORY api||  ***/

app.get("/brands", (req, res) => {
  db.collection("brands")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
app.get("/categories", (req, res) => {
  db.collection("categories")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//*** products based on BRAND || CATEGORY || ALL PRODUCTS  ***/

app.get("/allproducts", (req, res) => {
  let brandId = Number(req.query.brandId);
  let categoryId = Number(req.query.categoryId);
  let query = {};
  if (brandId) {
    query = { brand_id: brandId };
  } else if (categoryId) {
    query = { category_id: categoryId };
  } else {
    query = {};
  }
  db.collection("products")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//*** Products based on BRAND && CATEGORY with cost and sort***/

app.get("/filter/:brandID", (req, res) => {
  let query = {};
  let brandID = Number(req.params.brandID);
  let categoryId = Number(req.query.categoryId);
  let lcost = Number(req.query.lcost);
  let hcost = Number(req.query.hcost);
  let sort = { sell_price: 1 };

  if (req.query.sort) {
    sort = { sell_price: req.query.sort };
  }

  if (categoryId && hcost && lcost) {
    query = {
      brand_id: brandID,
      category_id: categoryId,
      $and: [{ sell_price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (hcost && lcost) {
    query = {
      brand_id: brandID,
      $and: [{ sell_price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (categoryId) {
    query = {
      brand_id: brandID,
      category_id: categoryId,
    };
  } else {
    query = {
      brand_id: brandID,
    };
  }
  db.collection("products")
    .find(query)
    .sort(sort)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//*** individual product ***/

app.get("/brands/:productId", (req, res) => {
  let productId = Number(req.params.productId);

  db.collection("products")
    .find({ id: productId })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//*** category with respect to product ***/

// app.get("/category/:categoryId", (req, res) => {
//   let productId = Number(req.params.productId);

//   db.collection("products")
//     .find({ id: productId })
//     .toArray((err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
// });

// ############### Order APIS #################//
app.get("/orders", (req, res) => {
  let email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email };
  }
  db.collection("orders")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// ############### PLACE ORDER #################//

app.post("/placeOrder", (req, res) => {
  db.collection("orders").insert(req.body, (err, result) => {
    if (err) throw err;
    res.send("Order Placed");
  });
});
// ############### CART #################//

app.post("/cart", (req, res) => {
  if (Array.isArray(req.body.id)) {
    db.collection("products")
      .find({ id: { $in: req.body.id } })
      .toArray((err, result) => {
        if (err) throw err;
        res.send(result);
      });
  } else {
    res.send("invalid");
  }
});

// ############### UPDATE ORDER #################//
app.put("/updateOrder/:id", (req, res) => {
  let ordId = Number(req.params.id);
  db.collection("orders").updateOne(
    { order_id: ordId },
    {
      $set: {
        status: req.body.status,
        bank_name: req.body.bank_name,
        date: req.body.date,
      },
    },
    (err, result) => {
      if (err) throw err;
      res.send("Order Updated");
    }
  );
});

// ############### DELETE ORDER #################//

app.delete("/deleteOrder/:id", (req, res) => {
  let _id = mongo.ObjectId(req.params.id);
  db.collection("orders").remove({ _id: _id }, (err, result) => {
    if (err) throw err;
    res.send("Order Deleted");
  });
});
