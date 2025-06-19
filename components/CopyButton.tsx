'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface CopyButtonProps {
  emoji: string;
  title: string;
  size?: 'small' | 'large';
  onCopy?: (emoji: string, title: string) => void;
}

export default function CopyButton({ emoji, title, size = 'large', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(true);
      showSuccess(`¡${emoji} copiado al portapapeles!`, 2000);
      onCopy?.(emoji, title);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy emoji:', err);
      try {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = emoji;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        showSuccess(`¡${emoji} copiado al portapapeles!`, 2000);
        onCopy?.(emoji, title);
        setTimeout(() => setCopied(false), 3000);
      } catch (fallbackErr) {
        showError('No se pudo copiar el emoji');
      }
    }
  };

  if (size === 'small') {
    return (
      <button
        onClick={handleCopy}
        className={`
          p-2 rounded-full transition-all duration-200 relative
          ${isAnimating ? 'transform scale-90' : 'transform scale-100'}
          ${copied 
            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
          }
        `}
        title={`Copiar ${title}`}
      >
        {copied ? (
          <Check className="h-4 w-4 animate-pulse" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        
        {/* Ripple effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-25 animate-ping" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center space-x-3 px-6 py-3 
        rounded-lg font-medium text-base transition-all duration-200 relative overflow-hidden
        ${isAnimating ? 'transform scale-95' : 'transform scale-100'}
        ${copied 
          ? 'bg-green-100 text-green-800 border border-green-300 shadow-md' 
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
      title={`Copiar ${title}`}
    >
      <span className={`text-xl transition-transform duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        {emoji}
      </span>
      {copied ? (
        <>
          <Check className="h-5 w-5 animate-bounce" />
          <span className="animate-pulse">¡Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-5 w-5" />
          <span>Copiar emoji</span>
        </>
      )}
      
      {/* Ripple effect for large button */}
      {isAnimating && (
        <div className="absolute inset-0 bg-blue-400 opacity-10 animate-ping rounded-lg" />
      )}
    </button>
  );
}