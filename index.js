import fs from 'fs';
import path from 'path';
import json2csv from 'json2csv';
import { fileURLToPath } from 'url';
import { 
    buildEntryExitRows,
    successMessage,
    errorMessage
} from './utils/index.js';
import { 
    tradovateColumns,
    importFile,
    exportFile,
    input,
    output
} from './consts/index.js';

// Define the __filename and __dirname variables, ES6-style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertMFFJsonToCSV = (jsonFilePath, csvFilePath) => {
    try {
        // Check if the MFF JSON file exists
        if (!fs.existsSync(jsonFilePath)) throw new Error(`File not found: ${jsonFilePath}`);
        
        // Read the MFF JSON file
        const rawJsonData = fs.readFileSync(jsonFilePath);
        const parsedJsonData = JSON.parse(rawJsonData)?.ok?.data;
        // Split each trade into entry and exit rows
        const csvData = parsedJsonData.reduce((csvRows, trade) => [...csvRows, ...buildEntryExitRows(trade)], []);
        // Convert the rows to .csv format
        const parsedCsvData = json2csv.parse(csvData, { fields: tradovateColumns });

        // Write the .csv file
        fs.writeFileSync(csvFilePath, parsedCsvData);

        successMessage(csvFilePath);
    } catch (error) {
        errorMessage(error);

        return;
    };
};

// Define the paths to the input JSON file and the output CSV file
const inputJsonPath = path.join(__dirname, input, importFile);
const outputCsvPath = path.join(__dirname, output, exportFile);

// Convert the MFF JSON file to a CSV file
convertMFFJsonToCSV(inputJsonPath, outputCsvPath);