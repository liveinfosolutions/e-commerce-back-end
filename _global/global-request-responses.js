const GLOBAL_MESSAGES = require('./global.messages');

// ! If got any err while saving new data (*Error Response)
exports.GOT_ERROR = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.ERROR_STATUS,
        data: err,
        message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    });
}

// ! If saved data not found after saving data (*Error Response)
exports.DATA_NOT_FOUND_ERROR = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.ERROR_STATUS,
        message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    });
}

// todo -> If data saved successfully ( SUCCESS )
exports.DATA_SAVED_SUCCESSFULLY = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.SUCCESS_STATUS,
        message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    });
}

// todo -> If data updated successfully ( SUCCESS )
exports.DATA_UPDATED_SUCCESSFULLY = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.SUCCESS_STATUS,
        message: GLOBAL_MESSAGES.FIELD_UPDATED_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    });
}

// todo -> Successfully removed data ( SUCCESS )
exports.DATA_REMOVED_SUCCESSFULLY = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.SUCCESS_STATUS,
        message: GLOBAL_MESSAGES.SUCCESSFULLY_REMOVED_DATA_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    });
}

// ! Password not match (*Error Response)

exports.PASSWORD_NOT_MATCH = (res,replace_LABEL_NAME_text) => {
    return res.status(200).send({
        status: GLOBAL_MESSAGES.ERROR_STATUS,
        message: GLOBAL_MESSAGES.PASSWORD_NOT_MATCH_ERROR_MESSAGE.replace('_LABEL_NAME', replace_LABEL_NAME_text)
    })
}