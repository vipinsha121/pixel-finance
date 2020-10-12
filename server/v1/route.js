const express = require('express');
const Routes = require('./routes/index');
const router = express();
router.use('/superAdmin', Routes.superAdminRoutes);
module.exports = router;
