exports.WEBSITE_DOMAIN_NAME = 'Live Info Solutions';
exports.FRONT_WEBSITE_URL = 'http://localhost:4200';

// Multiple super admins are allowed or not
exports.MULTIPLE_SUPER_ADMINS_ALLOWED = true;
exports.NUMBER_OF_SUPER_ADMINS_ALLOWED = 2 // (Number || UNLIMITED)
// Multiple sub-admins are allowed or not
exports.MULTIPLE_SUB_ADMINS_ALLOWED = true;
exports.NUMBER_OF_SUB_ADMINS_ALLOWED = 2 // (Number || UNLIMITED)

// Allowed image types
exports.MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
};

exports.IMAGE_SIZE_LIMIT = '10485760'; // In Bytes 1MB = 1048576 bytes

//----------------------------------------------------------------------------------
// Permissions Component
//----------------------------------------------------------------------------------
exports.PERMISSIONS = [
    'roles-management'
];