const fs = require('fs');

// todo -> Method to remove files
exports.DELETE_FILE = (filePath) => {
    fs.unlinkSync(filePath);
}