var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'FullStack Vietnam' });
});
router.get('/editor-img', function(req, res, next) {
    const images = fs.readdirSync('public/uploads')
    var sorted = [];
    for (let img of images) {
        if (img.split('.').pop() === "png" ||
            img.split('.').pop() === "jpg" ||
            img.split('.').pop() === "jpeg" ||
            img.split('.').pop() === "svg"
        ) {
            var abc = {
                "image": "/uploads/" + img,
                "folder": "/"
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
});


router.post('/delete_file', function(req, res, next) {
    var url_del = "public" + req.body.url_del
    console.log(url_del)
    if (fs.existsSync(url_del)) {
        fs.unlinkSync(url_del)
    }
    res.redirect('back')
})
module.exports = router;