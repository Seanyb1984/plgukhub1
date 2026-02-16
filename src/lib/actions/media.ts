'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth-helpers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadClinicalPhoto(formData: FormData, submissionId: string) {
  const session = await requireSession();
  const file = formData.get('file') as File;
  const fieldName = formData.get('fieldName') as string; // e.g., 'before_photo'

  if (!file) throw new Error("No file provided");

  // 1. Create secure storage path
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const relativePath = `/uploads/clinical/${session.user.brand.toLowerCase()}/${fileName}`;
  const absolutePath = join(process.cwd(), 'public', relativePath);

  // 2. Ensure directory exists
  await mkdir(join(process.cwd(), 'public', 'uploads', 'clinical', session.user.brand.toLowerCase()), { recursive: true });

  // 3. Write file and save to DB
  await writeFile(absolutePath, buffer);

  return await prisma.fileUpload.create({
    data: {
      submissionId,
      fieldName,
      originalName: file.name,
      storagePath: relativePath,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedById: session.user.id
    }
  });
}
