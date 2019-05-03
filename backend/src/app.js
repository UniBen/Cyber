/**
 * Imports
 */

// Node imports
const performance = require('perf_hooks').performance;
const { promisify } = require('util');

// Express imports
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const bodyParser = require('body-parser');

// Redis imports
const redis = require("redis");

// App imports
const ParseCSV = require('./lib/ParseCSV');

// Start app
const app = express();

// Create redis client
const cache = redis.createClient(6379, 'redis');

// Redis error handler
cache.on("error", err => console.log("Error " + err));

/**
 * Middleware
 */

// Sessions
app.set('trust proxy', 1);

app.use(session({
    secret: 'cyber',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// General
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * App
 */

app.get('/get/:key/:page?', async (req, res) => {
    const cacheKey = req.params.key;
    const page = req.params.page || 1;

    cache.llen(cacheKey, (err, count) => {
        if (!err && count) {
            console.log('Pulling ' + cacheKey + ' from cache');
            cache.lrange(cacheKey, (page-1) * 500, page * 500, (err, data) => {
                res.send(data.map(row => JSON.parse(row)));
            });
        }
    });
});

app.post('/upload', async (req, res) => {
    // Generate new cache key
    const cacheKey =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    console.log('Storing using ' + cacheKey + ' as cache key.');

    res.send({key: cacheKey});

    // Instantiate a new CSV parser.
    const parser = new ParseCSV(req.files.file, 50);

    parser.on('process', obj => {
        // Inserts the value in to a list.
        cache.rpush(cacheKey, JSON.stringify(obj).toString());
    });

    parser.on('done', () => {
        console.log('Finished processing file.');
        res.end();
    });

    parser.parse();
});

// Start Express server
app.listen(3000, () => console.log(`Example app listening on port 3000`));