import axios from 'axios';

interface ImageUploadResponse {
  url: string;
  public_id: string;
}

export const uploadImage = async (file: File, type?: string): Promise<ImageUploadResponse> => {
  try {
    console.log('Starting image upload for file:', file.name, 'Type:', type);
    console.log('File details:', {
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const formData = new FormData();
    formData.append('image', file);
    console.log('FormData created with file');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    console.log('Using API URL:', API_URL);

    const response = await axios.post(`${API_URL}/api/images/upload${type ? `?type=${type}` : ''}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('Upload progress:', percentCompleted + '%');
      }
    });

    console.log('Upload response:', response.data);
    
    if (!response.data.url || !response.data.public_id) {
      throw new Error('Invalid response from server: missing url or public_id');
    }

    return {
      url: response.data.url,
      public_id: response.data.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }
    throw error;
  }
}; 