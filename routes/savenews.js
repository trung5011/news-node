var express = require('express');
var bcrypt = require("bcrypt")
var crypto = require("crypto")
var router = express.Router();
var multer = require('multer');
var News = require("../models/news.model");
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "public/uploads/news");
    },
    filename: function(req, file, callback) {
        let type = 'jpg'
        if (file.mimetype === 'image/png') {
            type = 'png'
        } else if (file.mimetype === 'image/jpeg') {
            type = 'jpeg'
        } else {
            type = 'jpg'
        }
        callback(null, crypto.createHash('md5').update(Date.now() + "_" + removeVietnam(file.originalname.substring(0, 10))).digest('hex') + '.' + type);
    }
});
var upload = multer({
    storage: Storage
}).array(
    "imgUploader",
    10
);

function removeVietnam(s) {
    var r = s.toLowerCase().replace(/\s+/g, '-');
    non_asciis = {
        '-': '[`~!@#$%^&*()_|+=?;:",.<>/]',
        'a': '[ảàạảãàáâãäåắặẳằẵấầẩẫậâă]',
        'ae': 'æ',
        'c': 'ç',
        'e': '[èéẹẽẻềệếểễê]',
        'd': '[đ]',
        'i': '[ìíîïị]',
        'n': 'ñ',
        'o': '[òóôõöộồốổỗơởợỡờớôơ]',
        'oe': 'œ',
        'u': '[ùúûűüủụưửựứừữư]',
        'y': '[ýỳỷỵỹ]'
    };
    for (i in non_asciis) {
        r = r.replace(new RegExp(non_asciis[i], 'gi'), i);
    }
    r = r.replace(/[^\w\s]/gi, '-')
    return r
};
router.post('/', function(req, res, next) {

    upload(req, res, function(err) {
        if (err) {
            return res.end(err);
        } else {
            let {
                Title,
                Desc,
                SDesc
            } = req.body;
            console.log(req.files[0]);
            let friendly = removeVietnam(Title);
            var myData = new News({
                key: friendly,
                title: Title,
                desc: Desc,
                img: 'uploads/news/' + req.files[0].filename,
                sdesc: SDesc,
                status: true,
                name: crypto.createHash('sha256').update(Title).digest('hex')
            });
            myData.save().then(item => {
                    res.redirect("/news")
                        // res.send(item); // Chỉ bật lên khi viết APIs
                })
                .catch(err => {
                    next(err);
                    res.status(400).send("unable to save to database");
                });
        }
    })

})
router.post('/:id', function(req, res, next) {

    upload(req, res, function(err) {
        if (err) {
            return res.end("error");
        } else {
            let {
                Title,
                Desc,
                SDesc
            } = req.body;
            News.find({ name: req.params.id }, function(err, item) {
                if (err) {
                    return next(err);
                }

                let friendly = removeVietnam(Title);
                item[0].key = Title;
                item[0].title = Title;
                item[0].desc = Desc;
                if (req.files[0] != undefined) {
                    item[0].img = 'uploads/news/' + req.files[0].filename;
                    console.log('co thay ảnh')
                }
                item[0].sdesc = SDesc;
                item[0].status = true;
                item[0].name = crypto.createHash('sha256').update(Title).digest('hex')
                item[0].save(function(err) {
                    if (!err) {
                        console.log('update dc rồi');
                        res.redirect("/news");
                    } else {
                        console.log(err);
                    }
                });
            });
        }

    })
})
module.exports = router;