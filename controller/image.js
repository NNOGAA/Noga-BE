// PRISMA
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Upload = {
    label_ocr: async (res, req, data) => {
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

        const users = await prisma.ocr_table.findMany();

        return res.status(200).json(users);
    },
    no_label_ocr: async (res, req, data) => {
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
    }
}

module.exports = Upload