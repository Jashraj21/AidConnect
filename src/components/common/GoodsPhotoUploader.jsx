import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

// Preset realistic sample photos of donated goods for quick demo / testing
const SAMPLE_GOODS_PHOTOS = [
  {
    name: 'Food & Ration Packs',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Clean Drinking Water Pack',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Packaged Clothes & Blankets',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Medical & First Aid Kit',
    url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Resizes and optimizes an image file using HTML5 Canvas to keep local storage & payloads tiny (~80-120KB)
 */
function resizeImageFile(file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function GoodsPhotoUploader({
  photos = [],
  onChange,
  maxPhotos = 4,
  title = 'Photos of Goods / Parcels',
  subtitle = 'Upload or take photos of what you are donating so receivers and camp teams can verify the supplies.'
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);

    try {
      const remainingSlots = maxPhotos - photos.length;
      if (remainingSlots <= 0) {
        alert(`You can upload up to ${maxPhotos} photos.`);
        setIsProcessing(false);
        return;
      }

      const filesToProcess = Array.from(fileList).slice(0, remainingSlots);
      const newPhotoPromises = filesToProcess.map(file => resizeImageFile(file));
      const resizedDataUrls = await Promise.all(newPhotoPromises);

      onChange([...photos, ...resizedDataUrls]);
    } catch (err) {
      console.error('Error processing photos:', err);
      alert('Could not process selected image(s). Please try another image file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    const updated = photos.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddSample = (sampleUrl) => {
    if (photos.length >= maxPhotos) {
      alert(`You can add up to ${maxPhotos} photos.`);
      return;
    }
    onChange([...photos, sampleUrl]);
  };

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>{title}</span>
            <span className="text-[10px] text-slate-500 font-normal">
              ({photos.length}/{maxPhotos} attached)
            </span>
          </label>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {photos.length > 0 && (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Photos Attached</span>
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Dropzone & Action Box */}
      {photos.length < maxPhotos && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-slate-800">
                Take photo with Camera or upload from device
              </div>
              <div className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP • Max {maxPhotos} images
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Optimizing...' : 'Upload Goods Photo'}</span>
              </button>
            </div>
          </div>

          {/* Quick Sample Selector for immediate preview / testing */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-center flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Or choose sample relief parcel:</span>
            </span>
            {SAMPLE_GOODS_PHOTOS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleAddSample(sample.url)}
                className="px-2 py-0.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 rounded text-[10px] font-semibold transition-colors"
              >
                + {sample.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Photos Preview Gallery */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {photos.map((photoUrl, index) => (
            <div
              key={index}
              className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm aspect-video sm:aspect-square flex items-center justify-center"
            >
              <img
                src={photoUrl}
                alt={`Donated goods photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => setSelectedPreview(photoUrl)}
              />

              {/* Photo Number Badge */}
              <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                #{index + 1}
              </span>

              {/* Action Buttons on Hover */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(photoUrl)}
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow transition-all"
                  title="Enlarge photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-all"
                  title="Remove this photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full View */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 text-white border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Donated Goods Verification Photo</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/50">
              <img
                src={selectedPreview}
                alt="Donated Goods High Resolution Preview"
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
