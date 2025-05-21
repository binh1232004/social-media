/**
 * Uploads a file to Azure Blob Storage via the server-side API route
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Object containing the URL and media type of the uploaded file
 */
export async function uploadToAzureStorage(file, fileName) {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type on client side as well
    if (
      !file.type.startsWith('image/') &&
      file.type !== 'application/pdf' &&
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      throw new Error('Unsupported file type. Only images, PDFs, and Word documents are allowed.');
    }

    // Create form data to send to our API route
    const formData = new FormData();
    formData.append('file', file);

    // Call the server API route for upload
    const response = await fetch('/api/upload-media', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    // Parse the response from our upload API
    const data = await response.json();
    
    console.log(`File uploaded successfully: ${data.mediaUrl}`);
    return {
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType
    };  } catch (error) {
    console.error('Error uploading to Azure Storage:', error);
    throw error;
  }
}

/**
 * Determines the media type based on the file's MIME type
 * @param {string} mimeType - The MIME type of the file
 * @returns {string} - The media type (image, document)
 */
export function getMediaTypeFromMimeType(mimeType) {
  if (!mimeType) {
    return 'file';
  }

  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'document';
  } else {
    return 'file';
  }
}

/**
 * Determines the media type based on a file's URL or name
 * @param {string} fileNameOrUrl - File name or URL to analyze
 * @returns {string} - The media type (image, document)
 */
export function getMediaTypeFromUrl(fileNameOrUrl) {
  if (!fileNameOrUrl) {
    return 'file';
  }

  // Extract the file extension
  const extension = fileNameOrUrl.split('.').pop().toLowerCase();
  
  // Check for image extensions
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  // Check for document extensions
  else if (['pdf', 'doc', 'docx'].includes(extension)) {
    return 'document';
  }
  // Default to file for unknown extensions
  else {
    return 'file';
  }
}
