import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function createClientFolder(clientName: string, clientId: string) {
  try {
    const mainFolderMetadata = {
      name: `${clientName.toUpperCase()} (${clientId})`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_PARENT_ID!],
    };

    const mainFolder = await drive.files.create({
      requestBody: mainFolderMetadata,
      fields: 'id',
    });

    const folderId = mainFolder.data.id;
    const subFolders = ['Clinical Photos', 'Legal & Consent', 'Prescriptions'];
    
    for (const subName of subFolders) {
      await drive.files.create({
        requestBody: {
          name: subName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId!],
        },
      });
    }
    return folderId;
  } catch (error) {
    console.error('Google Drive Engine Error:', error);
    return null;
  }
}
