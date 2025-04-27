import { SupabaseClient } from '@supabase/supabase-js';

export const uploadFileToStorage = async (
  supabase: SupabaseClient,
  file: File,
  userId: string,
  folder: string
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file
    const { error } = await supabase.storage
      .from('resume_pdf') // Your bucket name
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    try {
      const {
        data: { publicUrl },
      } = supabase.storage.from('resume_pdf').getPublicUrl(filePath);

      return publicUrl;
    } catch (urlError) {
      console.error('Error getting public URL:', urlError);
      throw new Error('Failed to get public URL for uploaded file');
    }
  } catch (error) {
    console.error('Error in uploadFileToStorage:', error);
    throw error instanceof Error
      ? error
      : new Error('An unexpected error occurred during file upload');
  }
};
