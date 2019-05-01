// CSV
const parse = require('csv-parse');

module.exports  = class ParseCSV {
    compare = [];

    output = [];

    parser;

    file;

    lookBack;

    constructor(file, lookBack) {
        this.file = file;
        this.lookBack = lookBack ? lookBack : 5;
    }

    async parse() {
        return new Promise((resolve, reject) => {
             this.parser = parse({
                 delimiter: ','
             });

            this.parser.on('readable', () => {
                let record;

                while (record = this.parser.read()) {
                    const compareSize = this.compare.length;

                    if (this.compare.length > 0) {
                        (async () => {
                            let result = [];
                            for (let i = 0; i < record.length; i++) {
                                let difference = 0;

                                for (let j = 1; j < Math.min(this.lookBack, compareSize); j++) {
                                    difference += this.compare[this.compare.length - (j + 1)][i] !== record[i]
                                }

                                result.push({value: record[i], difference})
                            }

                            this.output.push(result);
                        })();
                    }

                    this.compare.push(record)
                }
            });

            this.parser.on('error', (err) => {
                console.error(err.message)
            });

            this.parser.on('end', () => {
                console.log('Done');
                resolve(this.output);
            });

            this.parser.write(this.file.data);

            this.parser.end();
        });
    }
};