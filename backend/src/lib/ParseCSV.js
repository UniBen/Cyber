// CSV
const EventEmitter = require("events").EventEmitter;
const parse = require('csv-parse');

module.exports  = class ParseCSV extends EventEmitter {
    compare = [];

    parser;

    file;

    lookBack;

    constructor(file, lookBack) {
        super();
        this.file = file;
        this.lookBack = lookBack ? lookBack : 5;
    }

    parse() {
        this.parser = parse({
            delimiter: ','
        });

        this.parser.on('readable', () => {
            let record;

            while (record = this.parser.read()) {
                const compareSize = this.compare.length;

                if (this.compare.length > 0) {
                    let result = [];
                    for (let i = 0; i < record.length; i++) {
                        let difference = 0;

                        for (let j = 1; j < Math.min(this.lookBack, compareSize); j++) {
                            difference += this.compare[this.compare.length - (j + 1)][i] !== record[i]
                        }

                        const value = {value: record[i], difference};

                        result.push(value);
                    }

                    this.emit('process', result);
                }
            }
        });

        // Emit the done event when the parser has finished.s
        this.parser.on('end', () => {
            this.emit('done');
        });

        // Start parsing.
        this.parser.write(this.file.data); this.parser.end();
    }
};