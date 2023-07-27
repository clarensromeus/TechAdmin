import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";

// creating the storage that defines where all the images will be uploaded
const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "/../Images"));
  },
  // differencing images with identical names
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const Upload = multer({ storage: Storage });

export default Upload;
