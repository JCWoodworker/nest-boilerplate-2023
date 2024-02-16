import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubappAccess } from './entities/userSubappAccess.entity';
import { Repository } from 'typeorm';

interface ImageSubmissionBody {
  inventoryId: string;
  inventoryType: string;
}

@Injectable()
export class SubappsService {
  constructor(
    @InjectRepository(UserSubappAccess)
    private readonly userSubappAccessRepository: Repository<UserSubappAccess>,
  ) {}

  async imageUpload(file: Express.Multer.File, body: ImageSubmissionBody) {
    // Console logging the request body for now.
    // This eventually needs to be validated and used to update the row in the database
    // that pertains to the specific location, room, or item's image being uploaded
    console.log(`Image Upload Request Body: ${JSON.stringify(body)}`);

    const s3Bucket = process.env.AWS_S3_BUCKET_NAME;
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      region: process.env.AWS_REGION,
    });
    try {
      const params = {
        Bucket: s3Bucket,
        Key: file.originalname,
        Body: file.buffer,
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      return {
        message: 'Image uploaded successfully',
        publicUrl: `https://${s3Bucket}.s3.amazonaws.com/${file.originalname}`,
      };
    } catch (error) {
      console.error(`Image upload error: ${error}`);
      return {
        message: `Image upload error: ${error}`,
      };
    }
  }

  async updateSubappUserData() {
    return { message: 'not yet implemented' };
  }
}