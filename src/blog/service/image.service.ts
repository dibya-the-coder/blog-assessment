import { Injectable } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class ImageUploadMiddleware {
  constructor(private readonly upload = multer()) {}

  async use(req, res, next) {
    try {
      const image = req.file;
      // Validate and process the image file as needed
      req.body.image = image; // Make the image available in the request body
      next();
    } catch (error) {
      // Handle any errors that occur during the upload process
      res.status(500).send({ message: 'Error uploading image' });
    }
  }
}
