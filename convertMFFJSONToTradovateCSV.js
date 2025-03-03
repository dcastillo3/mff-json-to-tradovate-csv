const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '');
}

function convertMFFJsonToCSV(jsonFilePath, csvFilePath) {
    const rawData = fs.readFileSync(jsonFilePath);
    const mffData = JSON.parse(rawData).ok.data;
    
    const tradovateColumns = [
        "orderId", "Account", "Order ID", "B/S", "Contract", "Product", "Product Description", "avgPrice",
        "filledQty", "Fill Time", "Side", "Status", "Order Time", "Quantity", "Text", "Type", "Limit Price",
        "Stop Price", "decimalLimit", "decimalStop", "Filled Qty", "Avg Fill Price", "decimalFillAvg", "Timestamp", "Date"
    ];

    let csvData = [];

    mffData.forEach(trade => {
        const entryDatetime = new Date(trade.entry_datetimes[0]).getTime();
        const closeDatetime = new Date(trade.close_datetimes[0]).getTime();
        const isLong = trade.short_long === "LONG";
        
        const entryRow = {
            "orderId": trade.order_ids[0] || "",
            "Account": trade.account_id,
            "Order ID": trade.tradehash,
            "B/S": isLong ? "Buy" : "Sell",
            "Contract": trade.asset,
            "Product": "NQ",
            "Product Description": "E-Mini NASDAQ 100",
            "avgPrice": trade.avg_market_entry,
            "filledQty": trade.total_contracts,
            "Fill Time": formatDate(entryDatetime),
            "Side": isLong ? "Buy" : "Sell",
            "Status": "Filled",
            "Order Time": formatDate(entryDatetime),
            "Quantity": trade.total_contracts,
            "Text": "Tradingview",
            "Type": "Limit",
            "Limit Price": trade.avg_market_entry,
            "Stop Price": "",
            "decimalLimit": trade.avg_market_entry,
            "decimalStop": "",
            "Filled Qty": trade.total_contracts,
            "Avg Fill Price": trade.avg_market_entry,
            "decimalFillAvg": trade.avg_market_entry,
            "Timestamp": formatDate(entryDatetime),
            "Date": formatDate(entryDatetime).split(' ')[0]
        };

        const exitRow = { ...entryRow };
        exitRow["B/S"] = isLong ? "Sell" : "Buy";
        exitRow["avgPrice"] = trade.avg_market_close;
        exitRow["Limit Price"] = trade.avg_market_close;
        exitRow["decimalLimit"] = trade.avg_market_close;
        exitRow["Filled Qty"] = trade.total_contracts;
        exitRow["Avg Fill Price"] = trade.avg_market_close;
        exitRow["decimalFillAvg"] = trade.avg_market_close;
        exitRow["Fill Time"] = formatDate(closeDatetime);
        exitRow["Order Time"] = formatDate(closeDatetime);
        exitRow["Timestamp"] = formatDate(closeDatetime);
        exitRow["Date"] = formatDate(closeDatetime).split(' ')[0];

        csvData.push(entryRow, exitRow);
    });

    const csv = parse(csvData, { fields: tradovateColumns });
    fs.writeFileSync(csvFilePath, csv);
    console.log(`CSV file saved to ${csvFilePath}`);
}

// Example usage
const inputJsonPath = path.join(__dirname, 'MFFTradeData.json');
const outputCsvPath = path.join(__dirname, 'MFF_TradeZella.csv');
convertMFFJsonToCSV(inputJsonPath, outputCsvPath);