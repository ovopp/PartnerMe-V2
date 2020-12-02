function queryDatabase(query, callback) {
    callback(null, "Would have ran ${query}");
}

export default queryDatabase;

function querySelectDatabase(query, callback) {
    callback(null, "Would have ran ${query}", "Example row for query: ${query}");
}

export default querySelectDatabase;
