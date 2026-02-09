// PLG UK Hub - Google Drive Integration Service
// Automatically creates client folders and syncs clinical photos + signed PDFs
// for redundant, GDPR-compliant storage.
//
// Requires environment variables:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GOOGLE_DRIVE_ROOT_FOLDER_ID

interface GoogleDriveConfig {
  serviceAccountEmail: string;
  privateKey: string;
  rootFolderId: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

function getConfig(): GoogleDriveConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '',
  };
}

// Generate JWT for Google API authentication
async function generateAccessToken(config: GoogleDriveConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: config.serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const base64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const signInput = `${base64url(header)}.${base64url(payload)}`;

  // Sign with RSA private key
  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(config.privateKey, 'base64url');

  const jwt = `${signInput}.${signature}`;

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Google access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Create a folder for a client in Google Drive.
 * Structure: Root / Brand / ClientName_ClientID /
 */
export async function createClientFolder(
  clientId: string,
  clientName: string,
  brand: string
): Promise<{ folderId: string; folderUrl: string }> {
  const config = getConfig();
  if (!config.serviceAccountEmail || !config.privateKey) {
    console.warn('Google Drive not configured. Skipping folder creation.');
    return { folderId: '', folderUrl: '' };
  }

  const token = await generateAccessToken(config);

  // Ensure brand folder exists
  const brandFolderId = await findOrCreateFolder(token, brand, config.rootFolderId);

  // Create client folder
  const folderName = `${clientName}_${clientId}`;
  const clientFolderId = await findOrCreateFolder(token, folderName, brandFolderId);

  // Create subfolders
  await Promise.all([
    findOrCreateFolder(token, 'Before Photos', clientFolderId),
    findOrCreateFolder(token, 'After Photos', clientFolderId),
    findOrCreateFolder(token, 'Signed Documents', clientFolderId),
    findOrCreateFolder(token, 'Clinical Records', clientFolderId),
  ]);

  return {
    folderId: clientFolderId,
    folderUrl: `https://drive.google.com/drive/folders/${clientFolderId}`,
  };
}

/**
 * Upload a file (photo or PDF) to a client's Google Drive folder.
 */
export async function uploadToClientFolder(
  clientFolderId: string,
  fileName: string,
  mimeType: string,
  fileContent: Buffer | string,
  subfolder?: string
): Promise<DriveFile> {
  const config = getConfig();
  if (!config.serviceAccountEmail || !config.privateKey) {
    console.warn('Google Drive not configured. Skipping upload.');
    return { id: '', name: fileName, mimeType };
  }

  const token = await generateAccessToken(config);

  // Find subfolder if specified
  let parentId = clientFolderId;
  if (subfolder) {
    parentId = await findOrCreateFolder(token, subfolder, clientFolderId);
  }

  // Handle base64 content
  let buffer: Buffer;
  if (typeof fileContent === 'string') {
    // Strip data URL prefix if present
    const base64Data = fileContent.replace(/^data:[^;]+;base64,/, '');
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    buffer = fileContent;
  }

  // Multipart upload
  const boundary = 'plgukhub_boundary';
  const metadata = JSON.stringify({
    name: fileName,
    parents: [parentId],
  });

  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!response.ok) {
    throw new Error(`Google Drive upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload a "Before" photo to the client's folder.
 */
export async function uploadBeforePhoto(
  clientFolderId: string,
  photoData: string,
  journeyId: string,
  photoIndex: number
): Promise<DriveFile> {
  const fileName = `before_${journeyId}_${photoIndex + 1}_${Date.now()}.jpg`;
  return uploadToClientFolder(clientFolderId, fileName, 'image/jpeg', photoData, 'Before Photos');
}

/**
 * Upload an "After" photo to the client's folder.
 */
export async function uploadAfterPhoto(
  clientFolderId: string,
  photoData: string,
  journeyId: string,
  photoIndex: number
): Promise<DriveFile> {
  const fileName = `after_${journeyId}_${photoIndex + 1}_${Date.now()}.jpg`;
  return uploadToClientFolder(clientFolderId, fileName, 'image/jpeg', photoData, 'After Photos');
}

/**
 * Upload a signed consent PDF to the client's folder.
 */
export async function uploadSignedPDF(
  clientFolderId: string,
  pdfBuffer: Buffer,
  journeyId: string
): Promise<DriveFile> {
  const fileName = `consent_${journeyId}_${Date.now()}.pdf`;
  return uploadToClientFolder(clientFolderId, fileName, 'application/pdf', pdfBuffer, 'Signed Documents');
}

// ============================================
// INTERNAL HELPERS
// ============================================

async function findOrCreateFolder(
  token: string,
  folderName: string,
  parentId: string
): Promise<string> {
  // Search for existing folder
  const query = encodeURIComponent(
    `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );

  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    if (searchData.files?.length > 0) {
      return searchData.files[0].id;
    }
  }

  // Create new folder
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });

  if (!createResponse.ok) {
    throw new Error(`Failed to create folder '${folderName}': ${createResponse.statusText}`);
  }

  const createData = await createResponse.json();
  return createData.id;
}
