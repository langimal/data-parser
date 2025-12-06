const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

class DataParser {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, filePath);
    }

    parseCSV() {
        try {
            const fileContent = fs.readFileSync(this.filePath, 'utf8');
            const parsedData = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
            });
            return parsedData;
        } catch (error) {
            throw new Error(`Failed to parse CSV file: ${error.message}`);
        }
    }

    saveToJSON(outputPath) {
        try {
            const data = this.parseCSV();
            const jsonContent = JSON.stringify(data, null, 2);
            fs.writeFileSync(outputPath, jsonContent, 'utf8');
            console.log(`Data successfully saved to ${outputPath}`);
        } catch (error) {
            throw new Error(`Failed to save JSON file: ${error.message}`);
        }
    }
}

module.exports = DataParser;