const fs = require('fs');

// * Method to remove files
exports.DELETE_FILE = (filePath) => {
    fs.unlinkSync(filePath);
}