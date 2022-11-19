const fs = require('fs');
const { readdir } = require('fs').promises;

/**
 * Retrieves all JavaScript files from the given directory
 * @param {string} dirPath The path to the directory being searched
 * @return {Array} The path to each js file within the directory
 */
module.exports = getFiles = async (dirPath) => {
    let files = [];
    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
        if (item.name.endsWith('.js')) {
            files.push(`${dirPath}/${item.name}`);
        }
    }
    return files;
}