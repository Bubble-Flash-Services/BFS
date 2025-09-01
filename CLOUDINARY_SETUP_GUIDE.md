# Cloudinary Setup Guide

Use this guide to enable employee attendance selfies and before/after task images storage with automatic 70day retention.

## 1) Create Cloudinary account
- Go to https://cloudinary.com and create an account
- In Dashboard, note your:
  - Cloud Name
  - API Key
  - API Secret

## 2) Configure environment variables
Create or update `server/.env` with:

```
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart the backend after saving.

## 3) Folders used
- Attendance selfies: `bfs/attendance/<employeeId>/<YYYY-MM-DD>.jpg`
- Task images: `bfs/orders/<orderId>/before.jpg` and `bfs/orders/<orderId>/after.jpg`

These are created automatically on first upload.

## 4) Automatic cleanup (7 days)
A daily job removes images older than 7 days in:
- `bfs/attendance`
- `bfs/orders`

This is implemented via `node-cron` and runs at 03:15 server time. See `server/services/cleanupScheduler.js`.

## 5) API quick test
Assuming the server runs on http://localhost:5000 and you have an employee token in `EMP_TOKEN`.

PowerShell examples:

```powershell
# Attendance selfie (Base64 data URI)
$img = "data:image/jpeg;base64,...."  # put a real base64 string here
Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/api/employee/attendance/selfie `
  -Headers @{ Authorization = "Bearer $env:EMP_TOKEN" } `
  -Body @{ image = $img }

# Task images upload (multipart form-data)
$before = Get-Item .\before.jpg
$after = Get-Item .\after.jpg
$Form = @{ before = $before; after = $after }
Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/api/employee/tasks/<orderId>/images `
  -Headers @{ Authorization = "Bearer $env:EMP_TOKEN" } `
  -Form $Form
```

Tip: From the web app, the upload is done via `FormData` automatically.

## 6) Troubleshooting
- If you see "Cloudinary env vars missing" in logs, set the env vars and restart the server.
- Ensure outbound internet access from the server host to connect to Cloudinary.
- To disable cleanup temporarily, comment out `startCleanupTasks()` in `server/app.js`.

---

For help: support@bubbleflash.in
