var express = require('express');
var router = express.Router();
const multer  = require('multer');

const path = require('path');
const bidea = path.join(__dirname, '../public/uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, bidea); // Fitxategiak gordetzeko karpeta
    },
    filename: function (req, file, cb) {
      // Fitxategiaren izena: "file.originalname-<timestamp>-<random>.<extension>"
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const nameAndExtension = file.originalname.split('.'); // Fitxategiaren luzapena mantentzeko
      cb(null, nameAndExtension[0] + '-' + uniqueSuffix + '.' + nameAndExtension[1]);
    }
});
const limits = {filesize: 2 * 1024 * 1024} // 2MB
const fileFilter = function (req, file, cb) {
    // Irudiak bakarrik onartuko dira
    if (file.mimetype.startsWith('image/png') || file.mimetype.startsWith('image/jpg')) {
        cb(null, true);
    } else {
        cb(new Error('Ezin da irudi mota hau kargatu: ' + file.mimetype), false);
    }
}
const upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter })

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file)

    // get current protocol, host, path
    var protocol = req.protocol;
    
    // get port
    var port = req.get('port');
    
    var host = req.get('host');

    // concatenate them all
    var url = protocol + '://' + host + '/uploads/' + req.file.filename;

    // req.body will hold the text fields, if there were any
    res.send(`Zure izena: ${req.body.name} <br/> Fitxategia: <a href='${url}'>Irudia ikusi</a>`)
})

module.exports = router;
