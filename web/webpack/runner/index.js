/**@format */

const path = require("path");
const dictionaryFinder = require("./collector/dictionary-finder");
const jsonWriter = require("./collector/json-writer");
const { formattor } = require("./collector/resource-formattor");

function generatePath(name) {
    const fullPath = path.resolve(__dirname, "../..", name);
    console.log(`generate path: ${fullPath}`);
    const data = dictionaryFinder(fullPath);
    return data;
}

function createPathListData() {
    const result = {};

    const dirList = ["public", "resources", "static"];
    for (const name of dirList) {
        const data = generatePath(name);
        if (Object.keys(data || {}).length) {
            result[name] = data;
        }
    }

    return result;
}

function execute() {
    const pathListData = createPathListData();
    const formattedData = formattor(pathListData);
    jsonWriter(JSON.stringify(formattedData), path.resolve(__dirname, "../../tianyu/res", "resource-list.json"));
}

execute();
