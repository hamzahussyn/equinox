const router = require("express").Router();
const path = require('path');

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../') + '/views/index.html');
})
router.use(require('./login'));
router.use(require('./signup'));
router.use(require('./equivalence'));
router.use(require('./logout'));
router.use(require('./profile'));

module.exports = router;