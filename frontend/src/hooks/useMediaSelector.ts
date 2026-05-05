'use client';

import { useState } from 'react';

interface UseMediaSelectorOptions {
  multiple?: boolean;
  mediaType?: 'image' | 'video' | 'all';
  maxSelection?: number;
  onSelect?: (selectedMedia: string | string[]) => void;
}

export function useMediaSelector(options: UseMediaSelectorOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | string[] | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleSelect = (media: string | string[]) => {
    setSelectedMedia(media);
    if (options.onSelect) {
      options.onSelect(media);
    }
    close();
  };

  return {
    isOpen,
    open,
    close,
    selectedMedia,
    handleSelect,
    selectorProps: {
      isOpen,
      onClose: close,
      onSelect: handleSelect,
      multiple: options.multiple,
      mediaType: options.mediaType,
      maxSelection: options.maxSelection,
    },
  };
}
