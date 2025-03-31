'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

// Define font options with display names and CSS class names
const fontOptions = [
  { name: 'Montserrat', class: 'font-montserrat' },
  { name: 'Open Sans', class: 'font-opensans' },
  { name: 'Raleway', class: 'font-raleway' },
  { name: 'Nunito', class: 'font-nunito' },
  { name: 'Source Serif Pro', class: 'font-sourceserif' },
  { name: 'Poppins', class: 'font-poppins' },
  { name: 'Oswald', class: 'font-oswald' },
  { name: 'Pacifico', class: 'font-pacifico' },
  { name: 'Lobster', class: 'font-lobster' },
  { name: 'Permanent Marker', class: 'font-permanent-marker' },
  { name: 'Fredoka One', class: 'font-fredoka-one' },
  { name: 'Bebas Neue', class: 'font-bebas-neue' },
  { name: 'Anton', class: 'font-anton' },
  { name: 'Abril Fatface', class: 'font-abril-fatface' },
  { name: 'Righteous', class: 'font-righteous' },
  { name: 'Cormorant Garamond', class: 'font-cormorant' },
  { name: 'Didot', class: 'font-didot' },
];

// Color options
const colorOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#4b5563' },
  { name: 'Light Gray', value: '#9ca3af' },
  { name: 'Silver', value: '#d1d5db' },
  { name: 'Yellow', value: '#fbbf24' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Light Blue', value: '#60a5fa' },
  { name: 'Lime Green', value: '#84cc16' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
];

// Carousel dimensions (Instagram 4:5 ratio)
const CAROUSEL_DIMENSIONS = {
  width: 1080,
  height: 1350
};

export default function Home() {
  // State for carousel customization
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontStyle, setFontStyle] = useState(fontOptions[0]);
  const [fontColor, setFontColor] = useState('#000000');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [carouselText, setCarouselText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showGeneratedSlides, setShowGeneratedSlides] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<string[]>([]);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update word count when text changes
  useEffect(() => {
    const words = carouselText.trim().split(/\s+/);
    setWordCount(carouselText.trim() === '' ? 0 : words.length);
  }, [carouselText]);

  // Handle logo upload
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setLogoImage(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle font selection
  const handleFontChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = fontOptions.find(font => font.name === e.target.value);
    if (selectedFont) {
      setFontStyle(selectedFont);
    }
  };

  // Click handler for logo upload area
  const handleLogoAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Split text into slides
  const splitTextIntoSlides = (text: string): string[] => {
    const words = text.trim().split(/\s+/);
    const slides: string[] = [];
    const wordsPerSlide = 30; // Adjust based on desired density
    
    for (let i = 0; i < words.length; i += wordsPerSlide) {
      const slideWords = words.slice(i, i + wordsPerSlide);
      slides.push(slideWords.join(' '));
    }
    
    return slides;
  };

  // Generate carousel slides
  const handleGenerateSlides = () => {
    if (carouselText.trim() === '') {
      alert('Please enter some text for your carousel.');
      return;
    }
    
    const slides = splitTextIntoSlides(carouselText);
    setGeneratedSlides(slides);
    setShowGeneratedSlides(true);
  };

  // Calculate font size based on text length
  const calculateFontSize = (text: string) => {
    if (!text) return 48; // Default size
    
    const length = text.length;
    
    if (length < 50) return 48;
    if (length < 100) return 42;
    if (length < 200) return 36;
    if (length < 300) return 30;
    return 24;
  };

  // Download slides as images
  const handleDownloadSlides = async () => {
    const zip = new JSZip();
    const slideElements = document.querySelectorAll('.carousel-slide');
    
    for (let i = 0; i < slideElements.length; i++) {
      const canvas = await html2canvas(slideElements[i] as HTMLElement, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: backgroundColor
      });
      
      const imageData = canvas.toDataURL('image/png');
      const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
      
      zip.file(`slide_${i + 1}.png`, base64Data, {base64: true});
    }
    
    const content = await zip.generateAsync({type: 'blob'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'instagram_carousel_slides.zip';
    link.click();
  };

  // Go back to editor
  const handleBackToEditor = () => {
    setShowGeneratedSlides(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="header-gradient p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram Carousel Generator</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Support</a></li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Instagram Carousel Generator</h1>
        
        {!showGeneratedSlides ? (
          <div className="bg-white text-black rounded-lg p-8 max-w-4xl mx-auto">
            <p className="mb-6">Enter your text, choose styling options, and generate your Instagram carousel slides.</p>
            
            {/* Text Input */}
            <div className="mb-6">
              <label className="block mb-2">Enter Your Text (Max 270 words)</label>
              <textarea 
                value={carouselText}
                onChange={(e) => setCarouselText(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded bg-gray-50"
                placeholder="Enter the text you want to convert into carousel slides..."
              ></textarea>
              <div className="text-right text-sm text-gray-500 mt-1">
                {wordCount} / 270 words
              </div>
            </div>
            
            {/* Background Color */}
            <div className="mb-6">
              <label className="block mb-2">Background Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 border border-gray-300" 
                  style={{ backgroundColor: backgroundColor }}
                ></div>
                <input 
                  type="text" 
                  value={backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="border border-gray-300 px-2 py-1 w-32"
                />
                <div className="flex flex-wrap gap-2 max-w-md">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setBackgroundColor(color.value)}
                      aria-label={`Select ${color.name} color`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Font Style */}
            <div className="mb-6">
              <label className="block mb-2">Font Style</label>
              <select 
                value={fontStyle.name}
                onChange={handleFontChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                {fontOptions.map((font) => (
                  <option key={font.name} value={font.name}>
                    {font.name}
                  </option>
                ))}
              </select>
              
              {/* Font preview */}
              <div className="mt-2 p-4 border border-gray-300">
                <p className={fontStyle.class}>
                  This is a preview of the {fontStyle.name} font
                </p>
              </div>
            </div>
            
            {/* Font Color */}
            <div className="mb-6">
              <label className="block mb-2">Font Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 border border-gray-300" 
                  style={{ backgroundColor: fontColor }}
                ></div>
                <input 
                  type="text" 
                  value={fontColor} 
                  onChange={(e) => setFontColor(e.target.value)}
                  className="border border-gray-300 px-2 py-1 w-32"
                />
                <div className="flex flex-wrap gap-2 max-w-md">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFontColor(color.value)}
                      aria-label={`Select ${color.name} color`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block mb-2">Logo (Optional, 75px height)</label>
              <div 
                onClick={handleLogoAreaClick}
                className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer"
              >
                {logoImage ? (
                  <div className="flex justify-center">
                    <img 
                      src={logoImage} 
                      alt="Uploaded logo" 
                      className="max-h-[75px]" 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-purple-600">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 mb-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      />
                    </svg>
                    <span>Click to upload logo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Logo will be resized to 75px height with proportional width and placed in the bottom corner of each slide.
              </p>
            </div>
            
            {/* Generate Button */}
            <div className="mt-8 text-center">
              <button 
                onClick={handleGenerateSlides}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                disabled={wordCount > 270}
              >
                Generate Carousel Slides
              </button>
            </div>
          </div>
        ) : (
          /* Generated Slides View */
          <div className="bg-white text-black rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Generated Carousel Slides</h2>
            
            <div className="grid grid-cols-1 gap-8">
              {generatedSlides.map((text, index) => (
                <div 
                  key={index}
                  className="carousel-slide border border-gray-300 p-8 flex flex-col items-center justify-center min-h-[400px] relative"
                  style={{ backgroundColor: backgroundColor }}
                >
                  <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full">
                    Slide {index + 1}
                  </div>
                  
                  <div className="text-center mb-auto mt-auto">
                    <p 
                      className={fontStyle.class}
                      style={{ 
                        color: fontColor, 
                        fontSize: `${calculateFontSize(text)}px`,
                        lineHeight: 1.4
                      }}
                    >
                      {text}
                    </p>
                  </div>
                  
                  {logoImage && (
                    <div className="self-end mt-auto">
                      <img 
                        src={logoImage} 
                        alt="Logo" 
                        className="max-h-[75px]" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <button 
                onClick={handleBackToEditor}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Back to Editor
              </button>
              
              <button 
                onClick={handleDownloadSlides}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Download Slides
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-16 py-8 bg-gray-800 text-center text-white">
        <p>© {new Date().getFullYear()} Instagram Carousel Generator. All rights reserved.</p>
        <div className="mt-2">
          <a 
            href="https://manus.ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-400 hover:text-white"
          >
            Made with Manus
          </a>
        </div>
      </footer>
    </main>
  );
}
