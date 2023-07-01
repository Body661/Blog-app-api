import S3 from 'aws-sdk/clients/s3.js';
import * as dotenv from 'dotenv'
dotenv.config()

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

function getFileStream(fileKey) {
    if (!fileKey) return

    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_BUCKET_NAME
    }

    return s3.getObject(downloadParams).createReadStream()
}

export { getFileStream }