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

        return res.status(200).json(result);
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
    },
    get_data_information: async (res, req, data) => {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({
                status: "error",
                message: "session_id is required",
            });
        }

        try {
            const result = await prisma.ocr_table.findUnique({
                where: {
                    sessionid: session_id,
                },
            });

            if (!result) {
                return res.status(404).json({
                    status: "pending",
                    message: "Data not found or still processing",
                    data: [],
                });
            }

            // Parse JSON strings if they exist
            let parsedResult = {
                sessionid: result.sessionid,
                status: result.status,
                ingredients: result.ingredients ? JSON.parse(result.ingredients) : null,
                nutrition_info: result.nutrition_info ? JSON.parse(result.nutrition_info) : null,
            };

            return res.status(200).json({
                status: "success",
                data: [parsedResult],
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch data",
                error: error.message,
            });
        }
    }
}

module.exports = Upload