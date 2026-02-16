import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { clientId, clientName } = await req.json();

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON in .env.local");
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Create the folder
    const fileMetadata = {
      name: clientName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_PARENT_ID!],
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, webViewLink',
    });

    return NextResponse.json({ 
      id: folder.data.id, 
      url: folder.data.webViewLink 
    });

  } catch (error: any) {
    console.error('? GOOGLE DRIVE API ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
