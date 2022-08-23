const fs = require('fs');
const { readdir } = require('fs').promises;

/**
 * Summary: Recursively searches the directory to find all .js files.
 * @param {string} dirPath The path to the directory being searched.
 * @return {Array} The path to each js file within the directory.
 */
module.exports = getFiles = async (dirPath) => {
    let files = [];
    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [
                ...files,
                ...(await getFiles(`${dirPath}/${item.name}`)),
            ];
        } else if (item.name.endsWith('.js')) {
            files.push(`${dirPath}/${item.name}`);
        }
    }
    return files;
}