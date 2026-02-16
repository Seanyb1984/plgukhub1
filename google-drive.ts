import { google } from 'googleapis';

/**
 * Initialize the Google Drive Client using Service Account credentials
 * stored in environment variables.
 */
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // The replace fixes common line-break issues in .env files
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  // 'drive.file' means the bot can only see folders it created (Best for privacy)
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Creates a structured patient folder inside your Clinical Vault.
 */
export async function createClientFolder(clientName: string, clientId: string) {
  try {
    // 1. Create the Main Patient Folder
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

    // 2. Create the Standard Sub-folders for CQC Compliance
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