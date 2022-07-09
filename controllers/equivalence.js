const express = require('express');
const { formData, DocumentTypes } = require('../middlewares/multer');
const router = express.Router();
const spawn = require("child_process").spawn;
const extractText = require('office-text-extractor');
const {removeFile} = require('../helpers/filesystem');
const verifyTokenHelper = require('../helpers/verifyTokenSync');


router.post(
  '/equivalence-results',
  formData('documents', DocumentTypes.DOCS).single('doc'),
  async (req, res) => {
    const { file } = req;

    if (!file) {
      res.status(400).json({ message: 'No file provided' });
    }

    let extractedText = await extractText(file.path);

    let processResult = "";
    let processResultJSON = {};
    const process = spawn('py',["./machine-learning.py", extractedText]);
    process.stdout.on('data', function(data) {
      processResult = data.toString();
      processResultJSON = JSON.parse(processResult);

      let resultJSON = {classes:[]};
      resultJSON.classes.push(processResultJSON.max);

      processResultJSON.classes.map((item) => {
        if(item !== processResultJSON.max){
          resultJSON.classes.push(item);
        }
      })

      removeFile(file.path);

      res.status(200).json({...resultJSON});
    })
  }
)

router
  .route('/equivalence')
  .get(async function (req, res) {
    if(!await verifyTokenHelper(req.cookies.authToken)){
      res.redirect('/login');
    }
    res.render('get-equivalence')
  })

module.exports = router