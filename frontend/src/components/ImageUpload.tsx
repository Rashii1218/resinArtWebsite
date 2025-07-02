import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { uploadImage } from '@/utils/imageUpload';
import { Image, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string, publicId: string) => void;
  onImageDeleted?: (publicId: string) => void;
  initialImages?: string[];
  publicIds?: string[];
  maxImages?: number;
  type?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onImageDeleted,
  initialImages = [],
  publicIds = [],
  maxImages = 4,
  type
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>(initialImages);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log('Files selected:', files);
    
    if (previews.length + files.length > maxImages) {
      toast({
        title: "Too many images ❌",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Create previews
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      console.log('Created previews:', newPreviews);
      setPreviews(prev => [...prev, ...newPreviews]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload images
      for (const file of Array.from(files)) {
        console.log('Uploading file:', file.name, 'Type:', file.type);
        const result = await uploadImage(file, type);
        console.log('Upload result:', result);
        onImageUploaded(result.url, result.public_id);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Success! 🎉",
        description: "Images uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed ❌",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      // Remove failed upload previews
      setPreviews(prev => prev.slice(0, -files.length));
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleDelete = async (index: number) => {
    if (publicIds[index] && onImageDeleted) {
      try {
        await onImageDeleted(publicIds[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Image Deleted",
          description: "The image has been removed successfully",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Delete Failed ❌",
          description: "Failed to delete image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {previews.length < maxImages && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to select an image
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WEBP (max 5MB)
              <br />
              {previews.length} of {maxImages} images uploaded
            </p>
          </label>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 