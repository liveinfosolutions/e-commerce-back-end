'use strict'
//------------------------------------------IMPORTS-------------------------------
const file = require('../../services/file');
const fs = require('fs');
//--------------------------------------------------------------------------------

function uploadImage(req, res) {
    const type = 'images';

    if (type.split('/').length > 0) {
        for (let i = 0; i < type.split('/').length; i++) {
            // check if root folder is available
            let curType = '';
            for (let j = 0; j < i + 1; j++) {
                curType += type.split('/')[j] + '/';
            }
            let dirExist = fs.existsSync(`assets/${curType}`)
            if (!dirExist) {
                fs.mkdirSync(`assets/${curType}`);
            }
        }
    }

    const url = req.protocol + '://' + req.get('host');
    let imagePath = `${type}/` + req.file.filename

    res.status(200).send({
        status: 'success',
        message: 'image uploaded successfully',
        imagePath: imagePath
    });
}


function deleteUploadedImage(req, res) {
    let filePath = req.body.filePath.split('images');
    let path = `assets/images${filePath[1]}`
    file.deleteFile(path);

    res.status(200).send({
        status: 'success',
        message: 'File Deleted Successfully'
    });
}

module.exports = {
    uploadImage,
    deleteUploadedImage
}