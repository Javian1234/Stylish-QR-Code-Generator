'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Settings, 
  Palette, 
  Type, 
  Link as LinkIcon, 
  LayoutGrid, 
  Circle, 
  Square, 
  Frame, 
  Cuboid, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Tag, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  FileText 
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function QRCodeGenerator() {
  const [mode, setMode] = useState<'url' | 'ar' | 'banner'>('banner');
  const [previewMode, setPreviewMode] = useState<'qr' | 'ar'>('qr');
  
  // AR states
  const [arTracking, setArTracking] = useState<'surface' | 'image'>('image');
  const [arName, setArName] = useState('AI Automation Store');
  const [arTitle, setArTitle] = useState('Interactive Menu Portal');
  const [arColor, setArColor] = useState('#0d9488');
  const [arImageUrl, setArImageUrl] = useState('');
  const [arAnimation, setArAnimation] = useState('float');

  // Standard QR states
  const [url, setUrl] = useState('https://wa.me/1234567890?text=Hello%20AI%20Assistant');
  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(12);
  
  const [dotsColor, setDotsColor] = useState('#0c4a6e');
  const [dotsType, setDotsType] = useState('classy'); // 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [cornersSquareColor, setCornersSquareColor] = useState('#0c4a6e');
  const [cornersSquareType, setCornersSquareType] = useState('extra-rounded'); // 'dot' | 'square' | 'extra-rounded'
  const [cornersDotColor, setCornersDotColor] = useState('#0284c7');
  const [cornersDotType, setCornersDotType] = useState('dot'); // 'dot' | 'square'
  
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(0.4);
  const [imageMargin, setImageMargin] = useState(4);

  const [frameText, setFrameText] = useState('SCAN TO ORDER');
  const [showFrame, setShowFrame] = useState(false);
  const [frameBgColor, setFrameBgColor] = useState('#0c4a6e');
  const [frameTextColor, setFrameTextColor] = useState('#ffffff');

  // NEW: Marketing Banner States
  const [bannerTemplate, setBannerTemplate] = useState<'market-emerald' | 'cyber-pulse' | 'royal-gold' | 'minimal-modern'>('market-emerald');
  const [contentType, setContentType] = useState<'url' | 'whatsapp'>('whatsapp');
  
  // WhatsApp builder content
  const [waPhone, setWaPhone] = useState('+1 (555) 019-2834');
  const [waMessage, setWaMessage] = useState('Hello! I would like to order and browse your menu.');

  // Custom text for the storefront poster
  const [bannerHeadline, setBannerHeadline] = useState('SCAN TO ORDER INSTANTLY');
  const [bannerSubheadline, setBannerSubheadline] = useState('Our smart AI response agent answers on WhatsApp in seconds!');
  const [bannerCta, setBannerCta] = useState('SCAN ME WITH YOUR CAMERA');
  const [bannerFooterNotes, setBannerFooterNotes] = useState('No Waiting in Line • Digital Interactive Catalog • Safe Cashless Checkout');

  // Business Info / Badges
  const [showSocialLabels, setShowSocialLabels] = useState(true);
  const [bannerWaLabel, setBannerWaLabel] = useState('+1 (555) 019-2834');
  const [bannerIgLabel, setBannerIgLabel] = useState('@ai_ordering_system');
  const [bannerTgLabel, setBannerTgLabel] = useState('AI_OrderBot');

  // Store Custom Logos
  const [clientLogo, setClientLogo] = useState<string | null>(null);

  const qrCodeRef = useRef<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const getFormattedData = (text: string) => {
    if (!text) return 'https://example.com';
    if (text.includes(' ') && !text.startsWith('http')) return text;
    if (/^[a-zA-Z0-9]+:/.test(text)) return text;
    if (text.includes('.')) return `https://${text}`;
    return text;
  };

  const getRelativeUrl = () => {
    if (mode === 'ar') {
      const config = {
        name: arName,
        title: arTitle,
        color: arColor,
        imageUrl: arImageUrl,
        animation: arAnimation
      };
      const encodedConfig = btoa(encodeURIComponent(JSON.stringify(config)));
      const path = arTracking === 'image' ? '/ar-target' : '/ar-view';
      return `${path}?config=${encodedConfig}`;
    }
    if (mode === 'banner' && contentType === 'whatsapp') {
      const cleanPhone = waPhone.replace(/[^0-9]/g, '');
      const encodedMessage = encodeURIComponent(waMessage);
      return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
    return getFormattedData(url);
  };

  const getFinalUrl = () => {
    if (mode === 'ar') {
      let baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
      if (baseUrl === 'null') baseUrl = 'https://example.com';
      return `${baseUrl}${getRelativeUrl()}`;
    }
    return getRelativeUrl();
  };

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      qrCodeRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: getFinalUrl(),
        image: image || undefined,
        margin: margin,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: imageSize,
          margin: imageMargin,
        },
        dotsOptions: {
          color: dotsColor,
          type: dotsType as any
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        cornersSquareOptions: {
          color: cornersSquareColor,
          type: cornersSquareType as any
        },
        cornersDotOptions: {
          color: cornersDotColor,
          type: cornersDotType as any
        }
      });

      if (ref.current) {
        ref.current.innerHTML = '';
        qrCodeRef.current.append(ref.current);
      }
    });
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.update({
      width: size,
      height: size,
      data: getFinalUrl(),
      image: image || undefined,
      margin: margin,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: imageSize,
        margin: imageMargin,
      },
      dotsOptions: {
        color: dotsColor,
        type: dotsType as any
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        color: cornersSquareColor,
        type: cornersSquareType as any
      },
      cornersDotOptions: {
        color: cornersDotColor,
        type: cornersDotType as any
      }
    });

    // Explicitly re-render standard DOM connection when mode switches
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCodeRef.current.append(ref.current);
    }
  }, [
    mode, 
    url, 
    arTracking,
    arName, 
    arTitle, 
    arColor, 
    arImageUrl, 
    arAnimation, 
    size, 
    margin, 
    dotsColor, 
    dotsType, 
    backgroundColor, 
    cornersSquareColor, 
    cornersSquareType, 
    cornersDotColor, 
    cornersDotType, 
    image, 
    imageSize, 
    imageMargin,
    bannerTemplate,
    contentType,
    waPhone,
    waMessage
  ]);

  const onDownloadClick = async (extension: 'svg' | 'png' | 'jpeg') => {
    const isFramedOrBanner = (showFrame && mode === 'url') || mode === 'banner';
    
    if (isFramedOrBanner && exportRef.current) {
      try {
        const titleText = mode === 'banner' ? 'marketing-storefront-banner' : 'framed-qr-code';
        
        // Supermarket banners require absolute crisp print resolutions. pixelRatio: 3 gives 1350x2000+ printable images
        const dataUrl = await (extension === 'png' ? htmlToImage.toPng(exportRef.current, { cacheBust: true, pixelRatio: 3 }) :
                               extension === 'jpeg' ? htmlToImage.toJpeg(exportRef.current, { quality: 0.98, cacheBust: true, pixelRatio: 3 }) :
                               htmlToImage.toSvg(exportRef.current, { cacheBust: true }));
        const link = document.createElement('a');
        link.download = `${titleText}.${extension}`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export high-definition banner poster', err);
      }
    } else if (qrCodeRef.current) {
      qrCodeRef.current.download({
        extension: extension
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setClientLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Controls Area */}
      <div className="w-full lg:w-[420px] bg-white border-r border-neutral-200 overflow-y-auto lg:h-screen p-6 space-y-8 shadow-md shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">QR Studio</h1>
          </div>
          <p className="text-sm text-neutral-500 font-medium">Create high-engagement storefront and WebAR QR assets</p>
        </div>

        {/* Global Mode Selector */}
        <div className="bg-neutral-100 p-1.5 rounded-2xl">
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-2 mb-2">Campaign Type</label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => { setMode('banner'); setPreviewMode('qr'); }}
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl transition-all ${mode === 'banner' ? 'bg-white text-indigo-700 shadow-sm font-bold border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Marketing Banner</span>
            </button>
            <button
              onClick={() => { setMode('url'); setPreviewMode('qr'); }}
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl transition-all ${mode === 'url' ? 'bg-white text-indigo-700 shadow-sm font-bold border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              <LinkIcon className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Standard Link</span>
            </button>
            <button
              onClick={() => { setMode('ar'); setPreviewMode('qr'); }}
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl transition-all ${mode === 'ar' ? 'bg-white text-indigo-700 shadow-sm font-bold border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              <Cuboid className="w-4 h-4 mb-1" />
              <span className="text-[11px]">AR Portal</span>
            </button>
          </div>
        </div>

        {/* SECTION: MARKETING BANNER BUILDER */}
        {mode === 'banner' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-600" /> Poster Template Style
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBannerTemplate('market-emerald')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${bannerTemplate === 'market-emerald' ? 'bg-emerald-800 border-emerald-950 text-white' : 'bg-white border-neutral-200 text-neutral-700'}`}
                >
                  🟢 Store Fresh
                </button>
                <button
                  onClick={() => setBannerTemplate('cyber-pulse')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${bannerTemplate === 'cyber-pulse' ? 'bg-violet-950 border-violet-900 text-white' : 'bg-white border-neutral-200 text-neutral-700'}`}
                >
                  🟪 Cyber Automation
                </button>
                <button
                  onClick={() => setBannerTemplate('royal-gold')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${bannerTemplate === 'royal-gold' ? 'bg-slate-900 border-amber-600 text-amber-400' : 'bg-white border-neutral-200 text-neutral-700'}`}
                >
                  🔵 Premium Classic
                </button>
                <button
                  onClick={() => setBannerTemplate('minimal-modern')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${bannerTemplate === 'minimal-modern' ? 'bg-neutral-900 border-black text-white' : 'bg-white border-neutral-200 text-neutral-700'}`}
                >
                  ⚫ Bold Swiss
                </button>
              </div>
            </div>

            {/* Campaign Direct Destination */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Destination Target
              </h2>
              
              <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg">
                <button
                  onClick={() => setContentType('whatsapp')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md ${contentType === 'whatsapp' ? 'bg-white text-indigo-700 shadow-sm' : 'text-neutral-500'}`}
                >
                  WhatsApp AI Link
                </button>
                <button
                  onClick={() => setContentType('url')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md ${contentType === 'url' ? 'bg-white text-indigo-700 shadow-sm' : 'text-neutral-500'}`}
                >
                  Any Custom Web Link
                </button>
              </div>

              {contentType === 'whatsapp' ? (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/50">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">WhatsApp Business Phone Number</label>
                    <input
                      type="text"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Welcome Auto-Response Message Code</label>
                    <textarea
                      rows={2}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      placeholder="Pre-programmed message which users send to invoke your AI responder model"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Web URL Address</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    placeholder="https://example.com/checkout"
                  />
                </div>
              )}
            </div>

            {/* Content Text Fields */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600" /> Poster Marketing Copy
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Main Banner Title (Headline)</label>
                  <input
                    type="text"
                    value={bannerHeadline}
                    onChange={(e) => setBannerHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Sub-headline Description</label>
                  <input
                    type="text"
                    value={bannerSubheadline}
                    onChange={(e) => setBannerSubheadline(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Call to Action (Below QR Code)</label>
                  <input
                    type="text"
                    value={bannerCta}
                    onChange={(e) => setBannerCta(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Footer Quality/Disclaimer Notes</label>
                  <input
                    type="text"
                    value={bannerFooterNotes}
                    onChange={(e) => setBannerFooterNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Logo uploads for the banner */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> Store / Business Branding
              </h2>
              
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-semibold text-neutral-700 mb-2">Upload Store/Client Logo</label>
                <div className="flex items-center gap-4">
                  {clientLogo ? (
                    <div className="relative">
                      <img src={clientLogo} className="w-14 h-14 rounded-xl object-contain border bg-white p-1" alt="Logo preview" />
                      <button
                        onClick={() => setClientLogo(null)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 text-[8px] font-bold w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <label className="cursor-pointer flex items-center justify-center border border-dashed border-neutral-300 hover:border-indigo-500 transition-all rounded-xl py-3 px-4 bg-white shadow-sm">
                        <Upload className="w-4 h-4 text-neutral-400 mr-2" />
                        <span className="text-xs font-bold text-indigo-600">Select Business Logo</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleClientLogoUpload} />
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5">Upload a transparent PNG/JPEG to place at the top of the storefront poster banner.</p>
              </div>
            </div>

            {/* Social Media Handlers list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-600" /> Business Media Badges
                </h2>
                <input
                  type="checkbox"
                  checked={showSocialLabels}
                  onChange={(e) => setShowSocialLabels(e.target.checked)}
                  className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </div>

              {showSocialLabels && (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/50">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase">WhatsApp Badge text</label>
                    <input
                      type="text"
                      value={bannerWaLabel}
                      onChange={(e) => setBannerWaLabel(e.target.value)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                      placeholder="+1 (555) 019-2834"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase">Instagram Label</label>
                    <input
                      type="text"
                      value={bannerIgLabel}
                      onChange={(e) => setBannerIgLabel(e.target.value)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                      placeholder="@insta_handle"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase">Telegram Bot/Chat Tag</label>
                    <input
                      type="text"
                      value={bannerTgLabel}
                      onChange={(e) => setBannerTgLabel(e.target.value)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                      placeholder="MyTelegramBot"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: STANDARD URL MODE CONTROLS */}
        {mode === 'url' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Standard Data Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                <LinkIcon className="w-4 h-4" /> Content
              </h2>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">URL or Text</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Frame / Text Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                <Type className="w-4 h-4" /> Text & Frame
              </h2>
              
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="showFrame" 
                  checked={showFrame} 
                  onChange={(e) => setShowFrame(e.target.checked)}
                  className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="showFrame" className="text-sm font-medium text-neutral-700 cursor-pointer">
                  Enable Text Frame
                </label>
              </div>

              {showFrame && (
                <div className="space-y-4 pl-6 border-l-2 border-neutral-100 ml-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Text</label>
                    <input
                      type="text"
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="SCAN ME"
                      maxLength={40}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Frame Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={frameBgColor}
                          onChange={(e) => setFrameBgColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs text-neutral-500 font-mono">{frameBgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={frameTextColor}
                          onChange={(e) => setFrameTextColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs text-neutral-500 font-mono">{frameTextColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: AR PORTAL CONTROLS */}
        {mode === 'ar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                <Cuboid className="w-4 h-4" /> AR Content Setup
              </h2>
              
              <div className="space-y-3">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide mb-2">Tracking Engine</label>
                  <div className="flex gap-2 p-1 bg-white rounded-lg border border-neutral-200">
                    <button
                      onClick={() => setArTracking('image')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md ${arTracking === 'image' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
                    >
                      Image Target (Pop Out)
                    </button>
                    <button
                      onClick={() => setArTracking('surface')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md ${arTracking === 'surface' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
                    >
                      Surface (Floor)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={arName}
                    onChange={(e) => setArName(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Job Title / Subtitle</label>
                  <input
                    type="text"
                    value={arTitle}
                    onChange={(e) => setArTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    placeholder="Creative Director"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={arColor}
                      onChange={(e) => setArColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-neutral-500 font-mono">{arColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={arImageUrl}
                    onChange={(e) => setArImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Provide a direct link to an image to display on the AR card.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Animation</label>
                  <select
                    value={arAnimation}
                    onChange={(e) => setArAnimation(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="float">Floating</option>
                    <option value="spin">Spinning</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REUSABLE STYLE CONTROLS (Common For Advanced Layout Customization) */}
        <div className="space-y-6 pt-4 border-t border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2 uppercase tracking-wide">
            <Palette className="w-4 h-4 text-indigo-600" /> QR Aesthetics
          </h2>

          {/* Core Colors Block */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Pattern Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={dotsColor}
                  onChange={(e) => setDotsColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs text-neutral-500 font-mono">{dotsColor}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">QR Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-200 p-0"
                />
                <span className="text-xs text-neutral-500 font-mono">{backgroundColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Corner Border</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cornersSquareColor}
                  onChange={(e) => setCornersSquareColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs text-neutral-500 font-mono">{cornersSquareColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Corner Dot</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cornersDotColor}
                  onChange={(e) => setCornersDotColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs text-neutral-500 font-mono">{cornersDotColor}</span>
              </div>
            </div>
          </div>

          {/* Core Shapes Block */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">QR Pattern Style</label>
              <select
                value={dotsType}
                onChange={(e) => setDotsType(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
              >
                <option value="rounded">Rounded Solid</option>
                <option value="dots">Modern Dots</option>
                <option value="classy">Classy Style</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="square">Standard Square</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase">Outer Corner Square</label>
                <select
                  value={cornersSquareType}
                  onChange={(e) => setCornersSquareType(e.target.value)}
                  className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-[11px]"
                >
                  <option value="extra-rounded">Round-Full</option>
                  <option value="square">Stark Square</option>
                  <option value="dot">Compact Dot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase">Inner Corner Dot</label>
                <select
                  value={cornersDotType}
                  onChange={(e) => setCornersDotType(e.target.value)}
                  className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-[11px]"
                >
                  <option value="dot">Rounded Pill</option>
                  <option value="square">Stark Square</option>
                </select>
              </div>
            </div>
          </div>

          {/* Centered QR Badge Logo */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-neutral-700">Inner QR Badge Logo (Direct Brand Target)</label>
            <div className="flex items-center gap-3">
              {image ? (
                <div className="relative">
                  <img src={image} className="w-12 h-12 object-contain rounded-lg border bg-white p-1" alt="Inner QR Brand" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 text-[8px] font-bold w-4 h-4 flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex-1">
                  <label className="cursor-pointer flex items-center justify-center border border-dashed border-neutral-300 hover:border-indigo-500 transition-all rounded-xl py-2 px-3 bg-white">
                    <Upload className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                    <span className="text-xs font-bold text-indigo-700">Badge Logo</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
            </div>

            {image && (
              <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase">Size: {Math.round(imageSize * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={imageSize}
                    onChange={(e) => setImageSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase">Outer Buffer: {imageMargin}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={imageMargin}
                    onChange={(e) => setImageMargin(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-700">Overall QR Scale Sizes</label>
              <span className="text-xs font-bold font-mono text-neutral-500">{size}x{size}px</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-neutral-400">QR Block Dimension</label>
                <input
                  type="range"
                  min="200"
                  max="400"
                  step="10"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400">QR Outer Margin ({margin}px)</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview and Rendering Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto min-h-screen">
        
        {/* AR Mode Toggles */}
        {mode === 'ar' && (
          <div className="flex justify-center mb-6 bg-neutral-200/50 p-1 rounded-2xl border border-neutral-200/50 shadow-sm shrink-0">
            <button 
              onClick={() => setPreviewMode('qr')} 
              className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${previewMode === 'qr' ? 'bg-white shadow-sm text-indigo-700' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Show QR Code
            </button>
            <button 
              onClick={() => setPreviewMode('ar')} 
              className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${previewMode === 'ar' ? 'bg-white shadow-sm text-indigo-700' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Interactive AR Sandbox
            </button>
          </div>
        )}

        {/* Dynamic Wrapper */}
        <div className="w-full flex flex-col items-center justify-center max-w-2xl">
          
          {/* Main Display Canvas Container */}
          <div className="bg-white/80 backdrop-blur-md p-6 lg:p-10 rounded-[36px] shadow-2xl border border-neutral-200/50 flex flex-col items-center w-full transition-all">
            
            {/* RENDER MODE: STANDARD QR / FRAME PREVIEW */}
            {mode === 'url' && (
              <div className="bg-neutral-50 p-6 rounded-[28px] border border-neutral-200/50 mb-8 flex items-center justify-center min-h-[420px] w-full max-w-[420px] shadow-inner relative overflow-hidden">
                <div 
                  ref={exportRef} 
                  className={`relative flex flex-col items-center justify-center transition-all ${showFrame ? 'p-8 pb-10 rounded-3xl shadow-lg' : ''}`}
                  style={showFrame ? { backgroundColor: frameBgColor } : {}}
                >
                  <div ref={ref} className="overflow-hidden rounded-2xl bg-white shadow-md border" />
                  {showFrame && (
                    <div 
                      className="mt-6 text-center font-black tracking-widest text-2xl w-full px-4 uppercase"
                      style={{ color: frameTextColor }}
                    >
                      {frameText}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RENDER MODE: AR SCAN AND INTERACTIVE SANDBOX */}
            {mode === 'ar' && (
              <div className="bg-neutral-50 p-6 rounded-[28px] border border-neutral-200/50 mb-8 flex flex-col items-center justify-center min-h-[420px] w-full max-w-[420px] shadow-inner relative overflow-hidden">
                {previewMode === 'ar' ? (
                  <div className="w-full flex justify-center items-center h-full gap-4">
                    {arTracking === 'image' && (
                      <div className="flex-1 max-w-[150px] bg-white p-3 rounded-2xl shadow-sm border text-center">
                        <img src="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" alt="Hiro Marker" className="w-full rounded-lg" />
                        <p className="text-[10px] font-bold mt-2 text-neutral-600">Scan this image!</p>
                      </div>
                    )}
                    <div className="shadow-md rounded-2xl overflow-hidden flex-1 border border-neutral-200 bg-white" style={{ maxWidth: arTracking === 'image' ? '250px' : '400px', height: arTracking === 'image' ? '350px' : '400px'}}>
                      <iframe 
                        src={getRelativeUrl()}
                        className="w-full h-full border-0 select-none pointer-events-none"
                        title="AR Preview Panel"
                        allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div ref={exportRef} className="flex flex-col items-center bg-white p-6 rounded-3xl border shadow-md">
                      <div ref={ref} className="overflow-hidden rounded-2xl bg-white" />
                      <div className="mt-4 text-center">
                        <span className="text-xs font-bold text-teal-600 tracking-wider">AUGMENTED PORTAL LINK</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-2 items-center w-full max-w-xs">
                      
                      <a 
                        href={mode === 'ar' ? getRelativeUrl() : getFinalUrl()} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg text-center hover:bg-indigo-100 transition-colors"
                      >
                        Desktop Test Link (Click Here)
                      </a>
                      
                      <div className="text-[10px] text-neutral-500 text-center bg-yellow-50 border border-yellow-200 p-2 rounded-lg leading-tight">
                        <strong>Note on 403 Errors:</strong> You are currently in a private development workspace. To scan with your phone, you must click <strong>Share</strong> in the top menu to publish a public version.
                      </div>
                    </div>

                    {arTracking === 'image' && (
                       <div className="mt-6 max-w-xs text-center border-t border-neutral-200 pt-4">
                         <div className="text-xs text-neutral-600 mb-2">
                           <span className="font-bold text-indigo-700">Prototype Mode:</span> We generated an AR experience using standard Marker Tracking. Print out the Hiro marker to see it leap off the paper!
                         </div>
                         <a href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">
                           ⬇️ Download Hiro Marker
                         </a>
                       </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RENDER MODE: COMPREHENSIVE MARKETING BANNER POSTER */}
            {mode === 'banner' && (
              <div className="mb-8 flex items-center justify-center w-full overflow-hidden shrink-0">
                {/* Visual Scale is 1:1 on full display, structured exactly as printable poster */}
                <div 
                  ref={exportRef}
                  className={`w-[450px] min-h-[640px] p-8 flex flex-col justify-between rounded-[32px] relative overflow-hidden shadow-2xl transition-all border-8 ${
                    bannerTemplate === 'market-emerald' ? 'bg-white border-emerald-800' :
                    bannerTemplate === 'cyber-pulse' ? 'bg-slate-950 border-cyan-500' :
                    bannerTemplate === 'royal-gold' ? 'bg-[#0B1E36] border-amber-500' :
                    'bg-neutral-50 border-neutral-900'
                  }`}
                >
                  {/* Banner Header Section */}
                  <div className="text-center space-y-2 select-none">
                    <div className="flex items-center justify-between w-full border-b pb-3 mb-2 border-opacity-20 border-current opacity-90">
                      {clientLogo ? (
                        <img src={clientLogo} className="h-10 w-10 object-contain rounded-md bg-white p-0.5" alt="Store logo" />
                      ) : (
                        <div className={`p-1.5 rounded-lg border border-current text-xs font-bold tracking-widest ${
                          bannerTemplate === 'cyber-pulse' ? 'bg-violet-900/30' : 'bg-transparent'
                        }`}>
                          AI POWERED
                        </div>
                      )}
                      
                      <div className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase ${
                        bannerTemplate === 'market-emerald' ? 'bg-emerald-800 text-emerald-50' :
                        bannerTemplate === 'cyber-pulse' ? 'bg-cyan-500 text-slate-950' :
                        bannerTemplate === 'royal-gold' ? 'bg-amber-500 text-blue-950' :
                        'bg-black text-white'
                      }`}>
                        SECURE ORDERING
                      </div>
                    </div>

                    <h3 className={`text-2xl font-black tracking-tight leading-none uppercase ${
                      bannerTemplate === 'market-emerald' ? 'text-emerald-900' :
                      bannerTemplate === 'cyber-pulse' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' :
                      bannerTemplate === 'royal-gold' ? 'text-amber-400' :
                      'text-black'
                    }`}>
                      {bannerHeadline || 'SCAN TO GET STARTED'}
                    </h3>
                    <p className={`text-xs font-semibold max-w-sm mx-auto ${
                      bannerTemplate === 'cyber-pulse' ? 'text-slate-400' :
                      bannerTemplate === 'royal-gold' ? 'text-slate-200 font-medium' :
                      'text-neutral-500'
                    }`}>
                      {bannerSubheadline || 'Chat with our AI automated storefront system'}
                    </p>
                  </div>

                  {/* QR Main Focus Zone */}
                  <div className="my-6 flex flex-col items-center justify-center relative">
                    <div className={`p-4 rounded-[24px] shadow-xl transition-all border ${
                      bannerTemplate === 'cyber-pulse' ? 'bg-white/10 border-cyan-500/30 backdrop-blur-md' : 'bg-white border-neutral-100'
                    }`}>
                      {/* Mount QR Generator Hook */}
                      <div ref={ref} className="overflow-hidden rounded-xl bg-white shadow-md" />
                    </div>
                    <div className="mt-4 text-center">
                      <span className={`text-sm font-black tracking-widest uppercase block ${
                        bannerTemplate === 'market-emerald' ? 'text-emerald-800' :
                        bannerTemplate === 'cyber-pulse' ? 'text-cyan-400' :
                        bannerTemplate === 'royal-gold' ? 'text-amber-400' :
                        'text-black'
                      }`}>
                        ⚡ {bannerCta || 'SCAN WITH CAMERA'} ⚡
                      </span>
                    </div>
                  </div>

                  {/* Banner Bottom Social Handles / Badges */}
                  <div className="space-y-4">
                    {showSocialLabels && (
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold select-none">
                        {bannerWaLabel && (
                          <div className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border ${
                            bannerTemplate === 'cyber-pulse' ? 'bg-slate-900/50 border-cyan-500/20 text-cyan-400' :
                            bannerTemplate === 'royal-gold' ? 'bg-blue-950/40 border-amber-500/20 text-slate-200' :
                            'bg-neutral-50 border-neutral-200 text-neutral-800'
                          }`}>
                            <svg className="w-3.5 h-3.5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.448 4.7 1.449 5.4 0 9.8-4.3 9.8-9.8-.003-5.3-4.3-9.7-9.8-9.7-5.4 0-9.8 4.3-9.8 9.8-.002 1.9.5 3.7 1.4 5.3L1.9 22.1l6.0-1.6c1.1.2 2.1.3 3.1.3z" />
                            </svg>
                            <span className="truncate">{bannerWaLabel}</span>
                          </div>
                        )}
                        {bannerIgLabel && (
                          <div className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border ${
                            bannerTemplate === 'cyber-pulse' ? 'bg-slate-900/50 border-cyan-500/20 text-cyan-400' :
                            bannerTemplate === 'royal-gold' ? 'bg-blue-950/40 border-amber-500/20 text-slate-200' :
                            'bg-neutral-50 border-neutral-200 text-neutral-800'
                          }`}>
                            <svg className="w-3.5 h-3.5 text-[#E1306C] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                            <span className="truncate">{bannerIgLabel}</span>
                          </div>
                        )}
                        {bannerTgLabel && (
                          <div className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border ${
                            bannerTemplate === 'cyber-pulse' ? 'bg-slate-900/50 border-cyan-500/20 text-cyan-400' :
                            bannerTemplate === 'royal-gold' ? 'bg-blue-950/40 border-amber-500/20 text-slate-200' :
                            'bg-neutral-50 border-neutral-200 text-neutral-800'
                          }`}>
                            <svg className="w-3.5 h-3.5 text-[#0088cc] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0C5.38 0 0 5.38 0 12s5.38 12 11.944 12c6.562 0 11.944-5.38 11.944-12S18.506 0 11.944 0zm5.821 7.424l-1.957 9.207c-.147.66-.541.821-1.09.516l-2.984-2.196-1.44 1.385c-.159.159-.292.292-.596.292l.213-3.048 5.56-5.018c.241-.213-.053-.332-.375-.118l-6.873 4.324-2.955-.923c-.642-.201-.655-.642.134-.951l11.536-4.445c.535-.195.999.123.844.925z" />
                            </svg>
                            <span className="truncate">{bannerTgLabel}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`text-center text-[10px] uppercase tracking-wider font-bold pt-3 border-t border-opacity-20 ${
                      bannerTemplate === 'cyber-pulse' ? 'text-violet-400 border-violet-500' :
                      bannerTemplate === 'royal-gold' ? 'text-amber-400/80 border-amber-500' :
                      'text-neutral-500 border-neutral-300'
                    }`}>
                      {bannerFooterNotes || 'INSTANT SECURE CONNECT'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Download Action Bar */}
            <div className="w-full max-w-md space-y-4">
              <div className="bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Pro High-Resolution Export
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full">
                  3X DIGITAL SCALE
                </span>
              </div>

              <button
                onClick={() => onDownloadClick('png')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-[0.99]"
              >
                <Download className="w-5 h-5" />
                Download Ready-to-Print PNG
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onDownloadClick('svg')}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  Vector SVG File
                </button>
                <button
                  onClick={() => onDownloadClick('jpeg')}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  Hi-Res JPEG
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
