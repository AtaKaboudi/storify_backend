const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const db = require('../Controllers/database')

const { ErrorHandler } = require('../Controllers/error')
router.get('/items', async (req, res, next) => {
    db.queryItemsUserId(req.body.id, (err, resu) => {
        if (err) next(new ErrorHandler(500, "Internal Server Error"));
        res.status(201).send(resu);
    })
})

router.get('/history', async (req, res, next) => {

    db.getHistory(req.body.id, (err, resu) => {
        if (err) next(new ErrorHandler(500, "Internal Server Error"));
        let result = [{ list: resu[0].list_name, list_updated_at: resu[0].list_updated_at, elements: [] }];
        let previous = resu[0].list_name
        resu.forEach((el, i) => {
            if (el.list_name == previous) {
                result[result.length - 1].elements.push(el)

            } else {
                result.push({ list: el.list_name, list_updated_at: el.list_updated_at, elements: [] });
                previous = el.list_name;
            }

        })
        res.status(201).send(result);
    })

})

router.get('/suggestions', async (req, res, next) => {
    db.querySuggestions((err, resu) => {
        if (err) next(new ErrorHandler(500, "Internal Server Error"));
        //FORMATINFG RESPONSE ACORDING TO TYPE
        console.log(resu);
        let response = [{ category: resu[0].category, elements: [] }];
        let prev = resu[0].category;
        resu.forEach((element, index) => {
            delete element.user_id;
            if (element.category != prev) {
                response.push({ category: element.category, elements: [element] })
            } else {
                response[response.length - 1].elements.push(element);
            }
            prev = element.category;
        });

        res.status(201).send(response);
    })
})



router.post('/items', async (req, res, next) => {
    let { name, category_id, image, note } = req.body;
    if (!((name) && (category_id) && (image) && (note))) return res.status(500).json({ "status": "error", "message": "INVALID_REQUEST_FORMAT" })

    db.insertItem(req.body, (err, resu) => {
        if (err) next(new ErrorHandler(500, "Internal Server Error"));
        res.send(resu);
    })
})


router.put('/items/:item_id', async (req, res, next) => {
    req.body.item_id = req.params.item_id
    db.modifyItem(req.body, (err, resu) => {
        if (err) next(new ErrorHandler(500, "Internal Server Error"));
        res.status(201).json({ "status": "succesful" });
    })
})







module.exports = router;