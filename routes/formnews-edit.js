var express = require('express');
var router = express.Router();
var News = require("../models/news.model")
    /* GET users listing. */
router.get('/:id', function(req, res, next) {
    News.find({ name: req.params.id }, function(err, item) {
        if (err) {
            return next(err);
        }
        res.render('formnews-edit', {
            title: 'FormNewsedit',
            data: item[0]
        });
        // res.json(items); // Dòng này chỉ bật khi viết API
    });

});

module.exports = router;