const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');

const mongoose = require("mongoose");
const budgetModel = require("./models/budget.js");

mongoose.connect("mongodb://127.0.0.1:27017/NBADProjectDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to the Database");
}).catch((err) => {
    console.error("Error connecting to the Database:", err);
});

app.use('/', express.static('public'));
app.use(cors())
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    budgetModel.find({})
        .then((data) => {
            res.json(data);
            // console.log(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post("/budget", (req, res) => {
    const data = req.body;

    Promise.all(data.map(itemData => {
        const newItem = new budgetModel(itemData);
        return newItem.save();
    }))
        .then((savedItems) => {
            res.json('Successfully added data');
            console.log(savedItems);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});