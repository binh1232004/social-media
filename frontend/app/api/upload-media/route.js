import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(request) {
  try {
    // Get form data (file)
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name;
    const fileType = file.type;
    
    // Only allow images, PDFs, and Word documents
    if (
      !fileType.startsWith('image/') && 
      fileType !== 'application/pdf' && 
      fileType !== 'application/msword' && 
      fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return NextResponse.json(
        { error: 'File type not supported. Only images, PDFs, and Word documents are allowed.' },
        { status: 400 }
      );
    }

    // Determine media type
    let mediaType = 'document';
    if (fileType.startsWith('image/')) {
      mediaType = 'image';
    }

    // Get Azure Storage credentials from environment variables
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    
    if (!connectionString || !containerName) {
      throw new Error('Azure Storage configuration is missing');
    }

    // Create unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    // Create BlobServiceClient using connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    // Get container client
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Get block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);
    
    // Convert file to buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Set content type
    const options = {
      blobHTTPHeaders: {
        blobContentType: fileType
      }
    };
    
    // Upload to Azure Blob Storage
    await blockBlobClient.upload(buffer, buffer.length, options);
    
    // Get the URL of the uploaded blob
    const mediaUrl = blockBlobClient.url;
    
    // Return success response with media details
    return NextResponse.json({
      success: true,
      mediaUrl,
      mediaType,
      fileName: uniqueFileName
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `File upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}