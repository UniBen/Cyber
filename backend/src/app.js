const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const transform = require('stream-transform');
const assert = require('assert');

const app = express();
const port = 3000;

app.use(cors());
app.use(fileUpload());

/**
 * Handle csv
 */
app.post('/upload', (req, res) => {
    console.log(req);

    res.send({status: 'done', files: req.files});

    return;

    const output = [];

    transform([
        ['1','2','3','4'],
        ['a','b','c','d']
    ], function(data){
        data.push(data.shift());
        return data
    })
        .on('readable', function(){
            while(row = this.read()){
                output.push(row)
            }
        })
        .on('error', function(err){
            console.error(err.message)
        })
        .on('finish', function(){
            assert.deepEqual(output, [
                [ '2', '3', '4', '1' ],
                [ 'b', 'c', 'd', 'a' ]
            ])

            res.send(output);
        })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));