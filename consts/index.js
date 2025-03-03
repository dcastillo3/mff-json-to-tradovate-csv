const tradovateColumns = [
    "orderId", "Account", "Order ID", "B/S", "Contract", "Product", "Product Description", "avgPrice",
    "filledQty", "Fill Time", "Side", "Status", "Order Time", "Quantity", "Text", "Type", "Limit Price",
    "Stop Price", "decimalLimit", "decimalStop", "Filled Qty", "Avg Fill Price", "decimalFillAvg", "Timestamp", "Date"
];

const buy = "Buy";
const sell = "Sell";
const nq = "E-Mini NASDAQ 100";
const long = "LONG";
const input = 'input';
const output = 'output';

// Set import and export file names
const importFile = 'MFFData.json';
const exportFile = 'TradovateData.csv';

export { 
    tradovateColumns,
    buy,
    sell,
    nq,
    long,
    importFile,
    exportFile,
    input,
    output
};