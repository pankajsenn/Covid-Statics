const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
const { tallySchema } = require('./schema');

app.get("/totalRecovered", async (req, res) => {
  try {
    let data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + data[i].recovered;
    }
    res.status(200).json({
      data: { _id: 'total', recovered: total }
    })
  }
  catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }
})
app.get("/totalActive", async (req, res) => {
  try {
    let data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      let active = data[i].infected - data[i].recovered;
      total = total + active;
    }
    res.status(200).json({
      data: { _id: 'total', active: total }
    })
  }
  catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }
})

app.get("/totalDeath", async (req, res) => {
  try {
    let data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + data[i].death;
    }
    res.status(200).json({
      data: { _id: 'total', death: total }
    })
  }
  catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }

})

app.get("/hotspotStates", async (req, res) => {
  try {
    let data = await connection.find();
    let rate;
    let datas = [];
    for (let i = 0; i < data.length; i++) {
      rate = (data[i].infected - data[i].recovered) / data[i].infected;
      rate = rate.toFixed(5);
      if (rate > 0.1) {
        datas.push({ state: data[i].state, rate: rate });
      }
    }
    res.status(200).json({
      datas
    })
  }
  catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }

})

app.get("/healthyStates", async (req, res) => {
  try{
    let data = await connection.find();
    let mortality;
    let datas = [];
    for (let i = 0; i < data.length; i++) {
      mortality = (data[i].death) / data[i].infected;
      mortality = mortality.toFixed(5);
      if (mortality < 0.005) {
        datas.push({ state: data[i].state, mortality: mortality });
      }
    }
    res.status(200).json({
      datas
    })
  }
  catch(e){
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }
  
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;