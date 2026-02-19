import multer from "multer";

const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});
