import { google } from 'googleapis';

export interface DownloadRequest {
  fileType: 'styles' | 'tones';
  userId: string;
}

export interface DownloadResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: string;
}

export async function generateDownloadLink(request: DownloadRequest): Promise<DownloadResponse> {
  try {
    const { fileType, userId } = request;

    if (!userId) {
      throw new Error('User ID required');
    }

    // Initialize Google Drive API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.REACT_APP_GOOGLE_DRIVE_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Get file ID based on type
    const fileId = fileType === 'styles' 
      ? process.env.REACT_APP_GOOGLE_DRIVE_STYLES_FILE_ID
      : process.env.REACT_APP_GOOGLE_DRIVE_TONES_FILE_ID;

    if (!fileId) {
      throw new Error('File ID not configured');
    }

    // Get file metadata
    const fileResponse = await drive.files.get({
      fileId: fileId,
      fields: 'name,size,webContentLink'
    });

    const file = fileResponse.data;
    
    if (!file) {
      throw new Error('File not found');
    }

    // Generate download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Convert bytes to MB
    const fileSizeInMB = file.size ? (parseInt(file.size) / (1024 * 1024)).toFixed(1) + ' MB' : 'Unknown';

    return {
      downloadUrl,
      fileName: file.name || `${fileType === 'styles' ? 'Indian_Styles_Package' : 'Indian_Tones_Package'}.zip`,
      fileSize: fileSizeInMB
    };

  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to generate download link');
  }
} 