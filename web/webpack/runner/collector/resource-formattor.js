/**@format */

const DIR_TURN_BACK = "..";
const DIR_TURN_TO_ROOT = "...";
const DIR_ROOT = "root";

function treeNodeInit(turnback) {
    return {
        [DIR_TURN_BACK]: turnback,
        [DIR_TURN_TO_ROOT]: DIR_ROOT,
    };
}

function processSource(basePath, source, target) {
    for (const fileName of Object.keys(source)) {
        if (typeof source[fileName] === "string") {
            target[basePath][fileName] = source[fileName];
        } else {
            const subPath = `${basePath}/${fileName}`;
            target[encodeURI(subPath)] = treeNodeInit(encodeURI(basePath));
            target[basePath][fileName] = null;
            processSource(subPath, source[fileName], target);
        }
    }
}

function getDirTree(sourceList) {
    const result = {};
    const basePath = DIR_ROOT;
    result[basePath] = treeNodeInit(basePath);
    processSource(basePath, sourceList, result);
    return result;
}

module.exports.formattor = getDirTree;
