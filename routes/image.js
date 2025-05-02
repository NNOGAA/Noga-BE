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

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


// UPLOAD FUNCTION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const basePath = "uploads/";
        const typePath = path.join(basePath, file.fieldname);

        if (!fs.existsSync(typePath)) {
            fs.mkdirSync(typePath, { recursive: true });
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

            const uploadedFiles = req.files;
            const host = req.protocol + "://" + req.get("host");

            if (!uploadedFiles || (!uploadedFiles.composition && !uploadedFiles.nutrition_info)) {
                return res.status(400).send({
                    status: 400,
                    message: "No files uploaded",
                });
            }

            const result = {
                composition: uploadedFiles.composition
                    ? `${host}/${uploadedFiles.composition[0].path.replace(/\\/g, "/")}`
                    : null,
                nutrition_info: uploadedFiles.nutrition_info
                    ? `${host}/${uploadedFiles.nutrition_info[0].path.replace(/\\/g, "/")}`
                    : null,
                sessionid: req.body.sessionid
            };

            return res.status(200).json(result);

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

            const uploadedFiles = req.files;
            const host = req.protocol + "://" + req.get("host");

            if (!uploadedFiles || !uploadedFiles.foods) {
                return res.status(400).send({
                    status: 400,
                    message: "No files uploaded",
                });
            }

            const result = {
                foods: uploadedFiles.foods
                    ? `${host}/${uploadedFiles.foods[0].path.replace(/\\/g, "/")}`
                    : null,
                sessionid: req.body.sessionid
            };

            return res.status(200).json(result);

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

module.exports = router;
