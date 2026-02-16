import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { uploadBeforePhoto, uploadAfterPhoto } from '@/lib/integrations/google-drive';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { clientId, episodeRef, photoData, photoType, photoIndex } = await request.json();

    if (!clientId || !photoData || !photoType) {
      return NextResponse.json({ error: 'clientId, photoData, and photoType are required' }, { status: 400 });
    }

    // Look up client's Google Drive folder
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { googleDriveFolderId: true, firstName: true, lastName: true },
    });

    if (!client?.googleDriveFolderId) {
      return NextResponse.json({ error: 'Client has no Google Drive folder' }, { status: 404 });
    }

    const upload = photoType === 'before'
      ? await uploadBeforePhoto(client.googleDriveFolderId, photoData, episodeRef || 'unknown', photoIndex || 0)
      : await uploadAfterPhoto(client.googleDriveFolderId, photoData, episodeRef || 'unknown', photoIndex || 0);

    return NextResponse.json({
      fileId: upload.id,
      fileName: upload.name,
      message: `${photoType} photo uploaded to Google Drive`,
    });
  } catch (error) {
    console.error('Google Drive upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
