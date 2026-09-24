import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  defaultProductName?: string;
  initialFile?: File | null;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  productId = 'SPC-7',
  defaultProductName = 'Peri Peri Masala',
  initialFile = null,
}) => {
  const { showToast, updateProductImage } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialFile) {
      handleFileChange(initialFile);
    }
  }, [initialFile]);

  // Support pasting image directly from clipboard (Ctrl+V / Cmd+V)
  React.useEffect(() => {
    if (!isOpen) return;
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFileChange(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!previewUrl || !selectedFile) {
      setErrorMessage('Please select or drop an image first.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/update-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          imageBase64: previewUrl,
          filename: 'peri-peri-masala.png',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadSuccess(true);
        const newImg = data.imagePath || previewUrl;
        updateProductImage(productId, newImg);
        showToast('Peri Peri Masala packaging image updated successfully!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        throw new Error(data.error || 'Failed to save product image');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadSuccess(false);
    setErrorMessage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key={`image-upload-wrapper-${productId}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            key={`image-upload-backdrop-${productId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            key={`image-upload-dialog-${productId}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#111118] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10 text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#F5DE88]">Update Product Image</h3>
                  <p className="text-xs text-[#A6A295]">{defaultProductName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Drag & Drop Area */}
            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]'
                    : 'border-white/20 bg-[#171722] hover:border-[#D4AF37]/60 hover:bg-[#1A1A26]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5DE88] mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Select, drag &amp; drop, or paste (Ctrl+V) your image
                </h4>
                <p className="text-xs text-[#A6A295] max-w-xs">
                  Provide your exact Peri Peri Masala packaging image (e.g. peri peri.png). It will immediately replace the product image across the entire store.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#D4AF37]">
                    Drag &amp; drop or click
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#F5DE88]">
                    Paste with Ctrl+V / ⌘V
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview Box */}
                <div className="relative w-full h-64 rounded-2xl bg-[#0A0A0F] border border-[#D4AF37]/30 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                    title="Remove and select another"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                    {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
                  </div>
                </div>

                {/* Upload action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    disabled={isUploading}
                    className="w-1/3 py-3 rounded-xl border border-white/20 text-white font-medium text-xs hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading || uploadSuccess}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5DE88] to-[#D4AF37] text-[#121212] font-bold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Applying Image...</span>
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                        <span>Updated Successfully!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Set As Exact Product Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Hint note */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-[#A6A295]">
                Once confirmed, this exact image replaces the Peri Peri Masala image across the store, search, product modal, and cart.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
