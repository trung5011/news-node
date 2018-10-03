var express = require('express');
var router = express.Router();
var News = require("../models/news.model")

router.get('/:id', function(req, res, next) {

    News.find({ name: req.params.id }, function(err, item) {
        if (err) {
            return next(err);
        }
        item[0].status = false;
        item[0].save(function(err) {
            if (!err) {
                console.log('xoá dc rồi');
                res.redirect("/news");
            } else {
                console.log(err);
            }
        });


    });

});
router.post('/trung', function(req, res, next) {
    var x = req.body.user;

    for (var y = 0; y < x.length; y++) {
        News.find({ name: x[y] }, function(err, item) {
            if (err) {
                return next(err);
            }
            item[0].status = false;
            item[0].save(function(err) {
                if (!err) {

                } else {
                    console.log(err);
                }
            });
        });
    }
});
module.exports = router;