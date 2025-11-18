require('dotenv').config();

// EXPRESS
const express = require("express");
const router = express.Router();

// MODULE
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// FUNCTION
const {generateRandomText} = require("../function/function");
const UploadImage = require('../controller/image');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


// UPLOAD FUNCTION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const basePath = "uploads/";
        const typePath = path.join(basePath, file.fieldname);

        if (!fs.existsSync(typePath)) {
            fs.mkdirSync(typePath, {recursive: true});
        }

        cb(null, typePath);
    },
    filename: function (req, file, cb) {
        const randomText = generateRandomText();
        const ext = path.extname(file.originalname) || '.jpg';
        const fileName = `${file.fieldname}-${randomText}${ext}`;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// LABEL OCR
router.post(
    "/packaged-food",
    (req, res, next) => {
        next();
    },
    upload.fields([
        {name: "composition", maxCount: 1},
        {name: "nutrition_info", maxCount: 1},
    ]),
    async function (req, res) {
        try {

            UploadImage.label_ocr(res, req, req.body)

        } catch (error) {
            console.error("Server error:", error);
            res.status(500).send({
                status: 500,
                message: "Error processing upload",
                error: error.message,
            });
        }
    }
);


// NO LABEL OCR
router.post(
    "/prepared-food",
    (req, res, next) => {
        next();
    },
    upload.fields([
        {name: "foods", maxCount: 1},
    ]),
    async function (req, res) {
        try {

            UploadImage.no_label_ocr(res, req, req.body)

        } catch (error) {
            console.error("Server error:", error);
            res.status(500).send({
                status: 500,
                message: "Error processing upload",
                error: error.message,
            });
        }
    }
);

// GET DATA INFORMATION (Check OCR Results)
router.post("/data-information", async function (req, res) {
    try {
        UploadImage.get_data_information(res, req, req.body);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send({
            status: "error",
            message: "Error fetching data",
            error: error.message,
        });
    }
});

module.exports = router;
