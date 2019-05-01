/**
 * Imports
 */

// Node
const performance = require('perf_hooks').performance;
const { promisify } = require('util');

// Express
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();

// Redis
const redis = require("redis");

// App imports
const ParseCSV = require('./lib/ParseCSV');
const chunk = require('./helpers/chunk');

/**
 * Bootstrap
 */

// Create redis client
const cache = redis.createClient(6379, 'redis');

// Redis error handler
cache.on("error", err => console.log("Error " + err));
cache.async = promisify(cache.get).bind(cache);

/**
 * Middleware
 */

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * App
 */

// Routes
app.post('/upload', async (req, res) => {
    const start = performance.now();

    console.log('Checking cache for ' + req.files.file.md5 + '.');
    const cached = await cache.async(req.files.file.md5);

    if (cached) {
        console.log('Cache hit.');
        console.log(performance.now() - start + 'ms');
        res.send(JSON.parse(cached).slice(0, 500));
        console.log(performance.now() - start + 'ms');
    } else {
        const parser = new ParseCSV(req.files.file, 50);

        parser.parse()
            .then((data) => {
                cache.set(req.files.file.md5, JSON.stringify(data));
                console.log(performance.now() - start + 'ms');
                res.send(data.slice(0, 500));
            })
            .catch((e) => {
                res.status(1000, {
                    error: e
                });
            });
    }
});

app.listen(3000, () => console.log(`Example app listening on port 3000`));