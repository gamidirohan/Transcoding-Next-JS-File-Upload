const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies
let transcodeProgress = 0;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).any();

app.post('/upload', upload, (req, res) => {
  // Parse formats from request body (as JSON string)
  let formats;
  try {
    formats = JSON.parse(req.body.formats);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid formats format.' });
  }

  // Validate formats array
  if (!formats || formats.length === 0) {
    return res.status(400).json({ error: 'Please select at least one output format.' });
  }

  const resolutions = {
    '1080p': '1920x1080',
    '720p': '1280x720',
    '480p': '854x480',
    '360p': '640x360',
  };

  req.files.forEach((file) => {
    // Loop through only selected formats
    formats.forEach((format) => {
      if (resolutions[format]) {
        const outputDir = path.join(__dirname, 'outputs');
        fs.mkdirSync(outputDir, { recursive: true });

        const outputFileName = `${path.basename(file.originalname, path.extname(file.originalname))}_${format}.mp4`;
        const outputPath = path.join(outputDir, outputFileName);

        // Start transcoding with specified resolution
        ffmpeg(file.path)
          .videoCodec('libx264')
          .size(resolutions[format])
          .outputOptions(['-preset', 'fast', '-crf', '23'])
          .on('progress', (progress) => {
            transcodeProgress = Math.round(progress.percent);
          })
          .on('end', () => {
            console.log(`Transcoding to ${format} completed for ${file.originalname}`);
          })
          .on('error', (err) => {
            console.error(`Error transcoding ${file.originalname}:`, err);
          })
          .save(outputPath);
      } else {
        console.warn(`Unknown format: ${format}`);
      }
    });
  });

  res.json({ message: 'Transcoding started.' });
});

app.get('/progress', (req, res) => {
  res.json({ progress: transcodeProgress });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
