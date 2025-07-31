/**@format */

const fs = require("fs");

function jsonWriter(data, target) {
    fs.writeFileSync(target, data, "utf-8");
}

module.exports = jsonWriter;
