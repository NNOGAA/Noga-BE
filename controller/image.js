// PRISMA
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Upload = {
    label_ocr: async (res, req, data) => {
        const uploadedFiles = req.files;
        const host = req.protocol + "://" + req.get("host");

        console.log('=== PACKAGED FOOD UPLOAD ===');
        console.log('Files:', uploadedFiles);
        console.log('SessionID:', req.body.sessionid);

        if (!uploadedFiles || (!uploadedFiles.composition && !uploadedFiles.nutrition_info)) {
            console.log('ERROR: No files uploaded');
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

        console.log('Result:', result);
        return res.status(200).json(result);
    },
    no_label_ocr: async (res, req, data) => {
        const uploadedFiles = req.files;
        const host = req.protocol + "://" + req.get("host");

        console.log('=== PREPARED FOOD UPLOAD ===');
        console.log('Files:', uploadedFiles);
        console.log('SessionID:', req.body.sessionid);

        if (!uploadedFiles || !uploadedFiles.foods) {
            console.log('ERROR: No files uploaded');
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

        console.log('Result:', result);
        return res.status(200).json(result);
    }
}

module.exports = Upload