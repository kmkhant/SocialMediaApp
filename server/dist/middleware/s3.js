import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: ".env.local" });
export const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env
            .SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, new mongoose.Types.ObjectId().toString());
        },
    }),
});
export const updateFile = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const { id } = req.params;
            cb(null, id);
        },
    }),
});
// console.log(process.env.ACCESS_KEY_ID);
export default upload;
