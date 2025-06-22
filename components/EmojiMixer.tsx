'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SpanishEmojiData, EmojiGroup } from '@/lib/types';
import { EmojiMixer as MixerEngine, EmojiMix, MixHistory } from '@/lib/emoji-mixer';
import QuickEmojiGrid from './QuickEmojiGrid';
import CopyButton from './CopyButton';

interface EmojiMixerProps {
  emojis: SpanishEmojiData[];
  groups: EmojiGroup[];
  initialEmoji1?: SpanishEmojiData;
  initialEmoji2?: SpanishEmojiData;
}

export default function EmojiMixer({ emojis, groups, initialEmoji1, initialEmoji2 }: EmojiMixerProps) {
  const router = useRouter();
  const [selectedEmoji1, setSelectedEmoji1] = useState<SpanishEmojiData | undefined>(initialEmoji1);
  const [selectedEmoji2, setSelectedEmoji2] = useState<SpanishEmojiData | undefined>(initialEmoji2);
  const [currentMix, setCurrentMix] = useState<EmojiMix | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentMixes, setRecentMixes] = useState<EmojiMix[]>([]);
  const [showSelector1, setShowSelector1] = useState(false);
  const [showSelector2, setShowSelector2] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showInitialHint, setShowInitialHint] = useState(true);

  // Filter to only mixer-friendly emojis for better success rate
  const mixerFriendlyEmojis = MixerEngine.filterMixerFriendlyEmojis(emojis);

  // Normalize emoji by removing variation selectors that cause URL encoding issues
  const normalizeEmoji = (emoji: string): string => {
    // Remove Variation Selector-16 (U+FE0F) which causes %EF%B8%8F in URLs
    return emoji.replace(/\uFE0F/g, '');
  };

  // Create emoji slug for URL
  const createEmojiSlug = (emoji1: string, emoji2: string): string => {
    const normalized1 = normalizeEmoji(emoji1);
    const normalized2 = normalizeEmoji(emoji2);
    return `${normalized1}-${normalized2}`;
  };

  // Load recent mixes and detect screen size on component mount
  useEffect(() => {
    setRecentMixes(MixHistory.getRecent(20));
    
    // Check if desktop on mount
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    // Show random combination by default if no initial emojis are provided
    if (!initialEmoji1 && !initialEmoji2) {
      // Small delay to let the component fully mount
      setTimeout(() => {
        randomizeEmojis();
      }, 500);
    }
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Auto-generate mix when both emojis are selected
  useEffect(() => {
    if (selectedEmoji1 && selectedEmoji2) {
      generateMix();
    } else {
      setCurrentMix(null);
      setError(null);
    }
  }, [selectedEmoji1, selectedEmoji2]);

  const generateMix = async () => {
    if (!selectedEmoji1 || !selectedEmoji2) return;

    setIsLoading(true);
    setError(null);

    try {
      const mix = await MixerEngine.createMix(selectedEmoji1, selectedEmoji2, 256);
      
      if (mix) {
        setCurrentMix(mix);
        // Save to history
        MixHistory.save(mix);
        setRecentMixes(MixHistory.getRecent(20));
        
        
        // Navigate to slug URL for better sharing (only if not already there)
        const slug = createEmojiSlug(selectedEmoji1.emoji, selectedEmoji2.emoji);
        const currentPath = window.location.pathname;
        const targetPath = `/mezclar/${slug}`;
        
        if (currentPath !== targetPath) {
          router.push(targetPath);
        }
      } else {
        setCurrentMix(null);
        setError('Lamentablemente estos emojis no se pueden mezclar');
        
      }
    } catch (err) {
      setCurrentMix(null);
      setError('Error al crear la mezcla. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const randomizeEmojis = async () => {
    setIsRandomizing(true);
    
    
    try {
      const maxAttempts = 5;
      let attempts = 0;

      const getRandomEmoji = () => {
        const randomIndex = Math.floor(Math.random() * mixerFriendlyEmojis.length);
        return mixerFriendlyEmojis[randomIndex];
      };

      while (attempts < maxAttempts) {
        attempts++;
        
        const emoji1 = getRandomEmoji();
        let emoji2 = getRandomEmoji();
        
        // Ensure we don't get the same emoji twice
        while (emoji2.hexcode === emoji1.hexcode && mixerFriendlyEmojis.length > 1) {
          emoji2 = getRandomEmoji();
        }

        // Test if this combination will work before setting it
        try {
          const mix = await MixerEngine.createMix(emoji1, emoji2, 256);
          if (mix) {
            // Success! Set the emojis and navigate to slug URL
            setSelectedEmoji1(emoji1);
            setSelectedEmoji2(emoji2);
            
            const slug = createEmojiSlug(emoji1.emoji, emoji2.emoji);
            const currentPath = window.location.pathname;
            const targetPath = `/mezclar/${slug}`;
            
            if (currentPath !== targetPath) {
              router.push(targetPath);
            }
            return;
          }
        } catch (error) {
          // Continue to next attempt
        }
      }

      // If we get here, all attempts failed - just set random emojis anyway
      // This should be very rare with the filtered list
      const emoji1 = getRandomEmoji();
      let emoji2 = getRandomEmoji();
      
      while (emoji2.hexcode === emoji1.hexcode && mixerFriendlyEmojis.length > 1) {
        emoji2 = getRandomEmoji();
      }

      setSelectedEmoji1(emoji1);
      setSelectedEmoji2(emoji2);
      
      // Navigate to slug URL even for fallback
      const slug = createEmojiSlug(emoji1.emoji, emoji2.emoji);
      const currentPath = window.location.pathname;
      const targetPath = `/mezclar/${slug}`;
      
      if (currentPath !== targetPath) {
        router.push(targetPath);
      }
    } finally {
      setIsRandomizing(false);
    }
  };

  const loadRecentMix = (mix: EmojiMix) => {
    setSelectedEmoji1(mix.emoji1Data);
    setSelectedEmoji2(mix.emoji2Data);
  };

  const shareMix = () => {
    if (!currentMix) return;
    
    const slug = createEmojiSlug(currentMix.emoji1, currentMix.emoji2);
    const url = `${window.location.origin}/mezclar/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${currentMix.spanishName} - BuscaEmojis`,
        text: currentMix.spanishDescription,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // Could add toast notification here
    }
  };

  const downloadMix = async () => {
    if (!currentMix || !currentMix.imageUrl) return;

    try {
      // Create filename from emoji names
      const filename = `${currentMix.emoji1Data.spanishTitle.toLowerCase().replace(/\s+/g, '-')}_${currentMix.emoji2Data.spanishTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
      
      // Fetch the image
      const response = await fetch(currentMix.imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open image in new tab
      window.open(currentMix.imageUrl, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
          🧪 Laboratorio de Emojis
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Experimenta con mezclas sorprendentes
        </p>
      </div>

      {/* Hero Section - Main Mixing Interface */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 mb-6">
          {/* First Emoji */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSelector1(!showSelector1);
                setShowSelector2(false);
              }}
              className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center border-2 ${showSelector1 ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
            >
              {selectedEmoji1 ? (
                <span className="text-3xl sm:text-4xl lg:text-6xl">{selectedEmoji1.emoji}</span>
              ) : (
                <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-400">➕</span>
              )}
            </button>
            
            {/* First Emoji Selector */}
            {showSelector1 && (
              <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 sm:absolute sm:top-full sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:translate-y-0 mt-0 sm:mt-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 sm:w-80 lg:w-96">
                <div className="relative p-4">
                  <button
                    onClick={() => setShowSelector1(false)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                
                  <QuickEmojiGrid
                    emojis={mixerFriendlyEmojis}
                    groups={groups}
                    initialSelectedEmoji={selectedEmoji1}
                    onEmojiSelect={(emoji) => {
                      setSelectedEmoji1(emoji);
                      setShowSelector1(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Plus/Random Button */}
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-bold">+</div>
            <button
              onClick={() => {
                randomizeEmojis();
                setShowInitialHint(false);
              }}
              disabled={isRandomizing}
              className={`px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 font-bold text-sm sm:text-base lg:text-lg disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 ${showInitialHint && !currentMix ? 'animate-pulse' : ''}`}
            >
              {isRandomizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Sorprendiendo...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Sorpréndeme</span>
                  <span className="sm:hidden">Sorpresa</span>
                </>
              )}
            </button>
          </div>

          {/* Second Emoji */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSelector2(!showSelector2);
                setShowSelector1(false);
              }}
              className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center border-2 ${showSelector2 ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
            >
              {selectedEmoji2 ? (
                <span className="text-3xl sm:text-4xl lg:text-6xl">{selectedEmoji2.emoji}</span>
              ) : (
                <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-400">➕</span>
              )}
            </button>
            
            {/* Second Emoji Selector */}
            {showSelector2 && (
              <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 sm:absolute sm:top-full sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:translate-y-0 mt-0 sm:mt-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 sm:w-80 lg:w-96">
                <div className="relative p-4">
                  <button
                    onClick={() => setShowSelector2(false)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                
                  <QuickEmojiGrid
                    emojis={mixerFriendlyEmojis}
                    groups={groups}
                    initialSelectedEmoji={selectedEmoji2}
                    onEmojiSelect={(emoji) => {
                      setSelectedEmoji2(emoji);
                      setShowSelector2(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop to close selectors */}
        {(showSelector1 || showSelector2) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowSelector1(false);
              setShowSelector2(false);
            }}
          />
        )}

        {/* Result Display */}
        {(isLoading || currentMix || error) && (
          <div className="text-center">
            
            {isLoading && (
              <div className="space-y-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Creando mezcla...</p>
              </div>
            )}

            {error && (
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl">❌</div>
                <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
              </div>
            )}

            {currentMix && (
              <div className="space-y-4">
                {currentMix.imageUrl ? (
                  <img 
                    src={currentMix.imageUrl} 
                    alt={currentMix.spanishName}
                    className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl sm:text-3xl">{currentMix.emoji1}</span>
                      <span className="text-lg sm:text-xl text-blue-500">+</span>
                      <span className="text-2xl sm:text-3xl">{currentMix.emoji2}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {currentMix.spanishName.charAt(0).toUpperCase() + currentMix.spanishName.slice(1)}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {currentMix.spanishDescription.charAt(0).toUpperCase() + currentMix.spanishDescription.slice(1)}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {currentMix.imageUrl && (
                    <button
                      onClick={downloadMix}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <span>📥</span>
                      <span>Descargar</span>
                    </button>
                  )}
                  <button
                    onClick={shareMix}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {currentMix && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 text-center">
            Mezcla original: {currentMix.emoji1} + {currentMix.emoji2}
          </p>
        </div>
      )}

      {/* Recent Mixes - Compact Display */}
      {recentMixes.length > 0 && !showSelector1 && !showSelector2 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Mezclas recientes</h3>
            <button
              onClick={() => {
                MixHistory.clear();
                setRecentMixes([]);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {recentMixes.slice(0, isDesktop ? 16 : 8).map((mix, index) => (
              <button
                key={`${mix.emoji1}-${mix.emoji2}-${index}`}
                onClick={() => loadRecentMix(mix)}
                className="flex-shrink-0 p-2 bg-white rounded-lg hover:shadow-md transition-all group border"
                title={mix.spanishName}
              >
                <div className="text-center space-y-1">
                  <img 
                    src={MixerEngine.getMixUrl(mix.emoji1, mix.emoji2, 32)}
                    alt={mix.spanishName}
                    className="w-6 h-6 mx-auto"
                  />
                  <div className="text-xs text-gray-600 group-hover:text-blue-600 max-w-16 truncate">
                    {mix.emoji1}{mix.emoji2}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}