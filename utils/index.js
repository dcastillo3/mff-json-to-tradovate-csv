import chalk from "chalk";
import { buy, long, nq, sell } from "../consts/index.js";

const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '');
};

const successMessage = csvFilePath => {
    console.log(chalk.green(`CSV file saved to ${csvFilePath}`));
};

const errorMessage = error => {
    console.error(chalk.red(error));
};

const buildEntryExitRows = trade => {
    const {
        entry_datetimes = [],
        close_datetimes = [],
        short_long = '',
        order_ids = [],
        account_id = '',
        tradehash = '',
        asset = '',
        avg_market_entry = 0,
        total_contracts = 0,
        avg_market_close = 0,
    } = trade;
    const entryDatetime = new Date(entry_datetimes?.[0])?.getTime();
    const closeDatetime = new Date(close_datetimes?.[0])?.getTime();
    const entryTimestamp = formatDate(entryDatetime);
    const closeTimestamp = formatDate(closeDatetime);
    const entryPosition = (short_long === long) ? buy : sell;
    const exitPosition = (short_long === long) ? sell : buy;

    const entryRow = {
        "orderId": order_ids?.[0] || "",
        "Account": account_id,
        "Order ID": tradehash,
        "B/S": entryPosition,
        "Contract": asset,
        "Product": "NQ",
        "Product Description": nq,
        "avgPrice": avg_market_entry,
        "filledQty": total_contracts,
        "Fill Time": entryTimestamp,
        "Side": entryPosition,
        "Status": "Filled",
        "Order Time": entryTimestamp,
        "Quantity": total_contracts,
        "Text": "Tradingview",
        "Type": "Limit",
        "Limit Price": avg_market_entry,
        "Stop Price": "",
        "decimalLimit": avg_market_entry,
        "decimalStop": "",
        "Filled Qty": total_contracts,
        "Avg Fill Price": avg_market_entry,
        "decimalFillAvg": avg_market_entry,
        "Timestamp": entryTimestamp,
        "Date": entryTimestamp.split(' ')[0]
    };

    const exitRow = { ...entryRow };
    exitRow["B/S"] = exitPosition;
    exitRow["avgPrice"] = avg_market_close;
    exitRow["Limit Price"] = avg_market_close;
    exitRow["decimalLimit"] = avg_market_close;
    exitRow["Filled Qty"] = total_contracts;
    exitRow["Avg Fill Price"] = avg_market_close;
    exitRow["decimalFillAvg"] = avg_market_close;
    exitRow["Fill Time"] = closeTimestamp;
    exitRow["Order Time"] = closeTimestamp;
    exitRow["Timestamp"] = closeTimestamp;
    exitRow["Date"] = closeTimestamp.split(' ')[0];

    return [entryRow, exitRow];
};

export { 
    formatDate,
    successMessage,
    errorMessage,
    buildEntryExitRows
};