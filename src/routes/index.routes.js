//------------------------------------------IMPORTS-------------------------------
const express = require('express');
const router = express.Router();
const AuthRoutes = require('./modules/auth.routes');
const CategoryRoute = require('./modules/category.routes');
//--------------------------------------------------------------------------------

router.use('/auth', AuthRoutes);
router.use('/category', CategoryRoute);

module.exports = router;