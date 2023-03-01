import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});



const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`);
});

export default router;
