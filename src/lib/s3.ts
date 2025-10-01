import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const uploadToS3 = async (file: Buffer, fileName: string, contentType: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `lab-reports/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
  }

  const result = await s3.upload(params).promise()
  return result.Location
}

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  const key = fileUrl.split('/').slice(-2).join('/')
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  }

  await s3.deleteObject(params).promise()
}