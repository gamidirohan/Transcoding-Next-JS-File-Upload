# Transcoding Project

This project is a video transcoding web application built with Next.js (frontend) and Express (backend). It allows users to upload video files, select output resolutions, and initiate transcoding with ffmpeg. Users can monitor the progress and view a list of transcoded videos.

## Features

- **File Upload**: Upload video files or folders.
- **Format Selection**: Choose transcoding resolutions (e.g., 1080p, 720p, 480p, 360p).
- **Progress Tracking**: Real-time upload and transcoding progress.
- **Video Streaming (Optional)**: View transcoded videos on a streaming page.

## Project Structure

```
transcoding-project/
├── transcoding-app/                 ## Next.js frontend (TypeScript, App Router)
│   ├── app/
│   │   ├── page.tsx                 ## Main upload page
│   │   ├── api/
│   │   │   └── progress/
│   │   │       └── route.ts         ## API route for checking transcoding progress
│   │   └── video-list/
│   │       └── page.tsx             ## (Optional) Video listing and streaming page
│   ├── public/                      ## Public assets (optional)
│   ├── tsconfig.json                ## TypeScript configuration
│   └── package.json                 ## Dependencies and scripts
└── transcoding-backend/             ## Express backend
    ├── uploads/                     ## Uploaded video files (auto-created)
    ├── outputs/                     ## Transcoded video files (auto-created)
    ├── index.js                     ## Main server file
    └── package.json                 ## Dependencies and scripts
```

## Prerequisites

- Node.js (v14+)
- ffmpeg: Ensure ffmpeg is installed and accessible in your PATH.

## Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd transcoding-project
   ```

2. **Setup Next.js Frontend**:

   Navigate to `transcoding-app` and install dependencies:

   ```bash
   npm install --legacy-peer-deps 
   cd transcoding-app
   npm install
   ```

   Run the development server:

   ```bash
   npm install express
>> npm install multer
>> npm install cors
>> npm install path
>> npm install fs
>> npm install ffmpeg
   npm run dev
   ```

   Access the frontend at [http://localhost:3000](http://localhost:3000).

3. **Setup Express Backend**:

   Open another terminal, navigate to `transcoding-backend`, and install dependencies:

   ```bash
   cd transcoding-backend
   npm install
   ```

   Start the backend server:

   ```bash
   node index.js
   ```

   The backend runs at [http://localhost:5000](http://localhost:5000).

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Drag and drop video files or folders into the upload area.
3. Select desired output resolutions (e.g., 1080p, 720p).
4. Click the Transcode button.
5. Monitor upload and transcoding progress.

(Optional) Visit `/video-list` to see all transcoded videos.

## API Endpoints

- **POST /upload**: Uploads files and initiates transcoding.
- **GET /progress**: Returns transcoding progress in percentage.

## Optional Video Listing and Streaming

The video-list page shows available transcoded videos that can be streamed directly in the browser.

## Troubleshooting

- **ffmpeg Not Found**: Ensure ffmpeg is installed and accessible in your system's PATH.
- **Preset Error**: If you encounter a missing preset error, use `.outputOptions(['-preset', 'fast'])` instead of `.preset('fast')`.

## License

This project is open-source and available under the MIT License.
```
