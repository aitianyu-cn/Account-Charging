/**@format */

const fs = require("fs");
const path = require("path");

const config = require("./config.json");

function fileFilter(fileName) {
    if (config.ignoredName.includes(fileName)) {
        return false;
    }
    let hasFiltered = false;
    for (const filterName of config.filter) {
        if (fileName.match(filterName)) {
            hasFiltered = true;
            break;
        }
    }
    return !hasFiltered;
}

/**
 *
 * @param {string} fileName
 */
function getFileExtension(fileName) {
    const subFileNames = fileName.split(".");
    if (subFileNames.length === 1) {
        return "";
    }

    const lastSplit = subFileNames[subFileNames.length - 1];
    return `.${lastSplit}`;
}

function searchFolder(rootPath) {
    const files = fs.readdirSync(rootPath);

    const result = {};
    const directories = [];
    for (const fileName of files) {
        if (!fileFilter(fileName)) {
            continue;
        }

        const filePath = path.join(rootPath, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            directories.push({ name: fileName, path: filePath });
        } else {
            result[fileName] = getFileExtension(fileName);
        }
    }

    for (const directory of directories) {
        const dirResult = searchFolder(directory.path);
        if (Object.keys(dirResult).length) {
            result[directory.name] = dirResult;
        }
    }

    return result;
}

module.exports = searchFolder;
