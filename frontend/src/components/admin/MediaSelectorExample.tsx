'use client';

import { useState } from 'react';
import { MediaSelector } from './MediaSelector';
import { useMediaSelector } from '@/hooks/useMediaSelector';
import { PhotoIcon } from '@heroicons/react/24/outline';

/**
 * Example component demonstrating how to use MediaSelector
 * 
 * This component shows three common use cases:
 * 1. Single image selection
 * 2. Multiple image selection (max 5)
 * 3. Video selection
 */
export function MediaSelectorExample() {
  // Example 1: Single image selection
  const [singleImage, setSingleImage] = useState<string>('');
  const singleSelector = useMediaSelector({
    multiple: false,
    mediaType: 'image',
    onSelect: (media) => setSingleImage(media as string),
  });

  // Example 2: Multiple image selection (max 5)
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const multipleSelector = useMediaSelector({
    multiple: true,
    mediaType: 'image',
    maxSelection: 5,
    onSelect: (media) => setMultipleImages(media as string[]),
  });

  // Example 3: Video selection
  const [video, setVideo] = useState<string>('');
  const videoSelector = useMediaSelector({
    multiple: false,
    mediaType: 'video',
    onSelect: (media) => setVideo(media as string),
  });

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Media Selector Examples
        </h1>
        <p className="text-neutral-600">
          Demonstrations of different MediaSelector configurations
        </p>
      </div>

      {/* Example 1: Single Image */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Example 1: Single Image Selection
        </h2>
        <p className="text-neutral-600 mb-4">
          Select a single image for a product thumbnail or hero image.
        </p>
        
        <button
          onClick={singleSelector.open}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <PhotoIcon className="h-5 w-5" />
          Select Image
        </button>

        {singleImage && (
          <div className="mt-4">
            <p className="text-sm text-neutral-600 mb-2">Selected image:</p>
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-neutral-200">
              <img
                src={singleImage}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500 break-all">{singleImage}</p>
          </div>
        )}

        <MediaSelector {...singleSelector.selectorProps} title="Select Product Image" />
      </div>

      {/* Example 2: Multiple Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Example 2: Multiple Image Selection (Max 5)
        </h2>
        <p className="text-neutral-600 mb-4">
          Select up to 5 images for a product gallery or carousel.
        </p>
        
        <button
          onClick={multipleSelector.open}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <PhotoIcon className="h-5 w-5" />
          Select Images ({multipleImages.length}/5)
        </button>

        {multipleImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-neutral-600 mb-2">
              Selected images ({multipleImages.length}):
            </p>
            <div className="grid grid-cols-5 gap-2">
              {multipleImages.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200"
                >
                  <img
                    src={url}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <MediaSelector
          {...multipleSelector.selectorProps}
          title="Select Product Gallery Images"
        />
      </div>

      {/* Example 3: Video Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Example 3: Video Selection
        </h2>
        <p className="text-neutral-600 mb-4">
          Select a video for product demonstration or tutorial.
        </p>
        
        <button
          onClick={videoSelector.open}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <PhotoIcon className="h-5 w-5" />
          Select Video
        </button>

        {video && (
          <div className="mt-4">
            <p className="text-sm text-neutral-600 mb-2">Selected video:</p>
            <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
              <video
                src={video}
                controls
                className="w-full h-full"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500 break-all">{video}</p>
          </div>
        )}

        <MediaSelector {...videoSelector.selectorProps} title="Select Product Video" />
      </div>

      {/* Code Examples */}
      <div className="bg-neutral-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Usage Code</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              Single Image Selection:
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const [image, setImage] = useState<string>('');
const selector = useMediaSelector({
  multiple: false,
  mediaType: 'image',
  onSelect: (media) => setImage(media as string),
});

<button onClick={selector.open}>Select Image</button>
<MediaSelector {...selector.selectorProps} />`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              Multiple Images (Max 5):
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const [images, setImages] = useState<string[]>([]);
const selector = useMediaSelector({
  multiple: true,
  mediaType: 'image',
  maxSelection: 5,
  onSelect: (media) => setImages(media as string[]),
});

<button onClick={selector.open}>Select Images</button>
<MediaSelector {...selector.selectorProps} />`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              Video Selection:
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const [video, setVideo] = useState<string>('');
const selector = useMediaSelector({
  multiple: false,
  mediaType: 'video',
  onSelect: (media) => setVideo(media as string),
});

<button onClick={selector.open}>Select Video</button>
<MediaSelector {...selector.selectorProps} />`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
