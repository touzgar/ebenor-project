'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { GalleryImage } from '@/types';

interface SortableGalleryItemProps {
  image: GalleryImage;
  index: number;
  isSelected: boolean;
  onSelect: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  isDragging: boolean;
}

export default function SortableGalleryItem({
  image,
  index,
  isSelected,
  onSelect,
  onDelete,
  isDragging,
}: SortableGalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
  } = useSortable({ id: image._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white rounded-lg shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isCurrentlyDragging ? 'border-amber-500 z-50' : 'border-neutral-200'
      } ${isDragging && !isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
        title="Glisser pour réorganiser"
      >
        <svg
          className="w-5 h-5 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Selection Checkbox */}
      <div className="absolute top-3 right-3 z-20">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(image._id!)}
          className="w-5 h-5 text-amber-600 border-2 border-white rounded shadow-lg focus:ring-amber-500 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Featured Badge */}
      {image.featured && (
        <div className="absolute top-14 left-3 z-10">
          <div className="bg-amber-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">Vedette</span>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={image.thumbnailUrl || image.url}
          alt={image.alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {image.title}
            </h3>
            {image.category && (
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                {image.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 text-sm mb-2 line-clamp-1">
          {image.title}
        </h3>
        
        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {image.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <Link
            href={`/admin/gallery/${image._id}/edit`}
            className="text-amber-600 hover:text-amber-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image._id!);
            }}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
