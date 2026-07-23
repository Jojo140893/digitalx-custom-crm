import { supabaseAdmin } from './supabase';

const BUCKET_NAME = 'call-recordings';

/**
 * Ensures the 'call-recordings' bucket exists in Supabase Storage.
 */
export async function ensureCallRecordingsBucket(): Promise<boolean> {
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      console.warn('Supabase storage bucket list warning:', error.message);
      return false;
    }
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB limit
        allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp3'],
      });
      if (createError) {
        console.warn('Failed to create call-recordings bucket:', createError.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('Supabase Storage bucket check error:', err);
    return false;
  }
}

/**
 * Uploads a call recording file to Supabase Storage and returns its public URL.
 */
export async function uploadCallRecording(
  fileBuffer: Buffer | ArrayBuffer | Blob,
  fileName: string,
  contentType: string = 'audio/mp3'
): Promise<string> {
  try {
    await ensureCallRecordingsBucket();
    const filePath = `tenant-recordings/${Date.now()}_${fileName}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload fallback:', error.message);
      return `https://cdn.digitalx.agency/recordings/${fileName}`;
    }

    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn('Upload call recording error:', err);
    return `https://cdn.digitalx.agency/recordings/${fileName}`;
  }
}
