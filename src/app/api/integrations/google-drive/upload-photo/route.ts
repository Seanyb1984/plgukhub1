import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { clientId, fileName, fileData, folderId } = await req.json();

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error("Missing Google Service Account JSON");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Convert base64 image data to a readable stream for Google
    const base64Data = fileData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const { Readable } = require('stream');
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const file = await drive.files.create({
      requestBody: {
        name: `${fileName}.jpg`,
        parents: [folderId],
      },
      media: {
        mimeType: 'image/jpeg',
        body: readableStream,
      },
      fields: 'id, webViewLink',
    });

    return NextResponse.json({ success: true, url: file.data.webViewLink });
  } catch (error: any) {
    console.error('❌ PHOTO UPLOAD ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
