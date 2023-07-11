import multer, { Multer, StorageEngine } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
});
export const upload: Multer = multer({ storage: storage });

export default upload;
