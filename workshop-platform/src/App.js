import React, { useState } from 'react';
import { File, Video, Image, Trash2, Play, BookOpen, RefreshCw, Lightbulb, Zap } from 'lucide-react';
import ContentCategories from './ContentCategories';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [files, setFiles] = useState({
    slides: [  {
      id: 1,
      name: 'Workshop Presentation',
      type: 'application/pdf',
      url: '/slides/Workshop Presentation.pdf',
      thumbnail: '/slides/Workshop_Presentation-thumbnail.png',
      uploadedAt: new Date().toISOString()
    }],
    examples: [],
    hooks: []
  });

  const [dragOver, setDragOver] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(null);
  const [linkForm, setLinkForm] = useState({ url: '', name: '' });

  const handleFileUpload = (section, event) => {
    event.preventDefault();
    const uploadedFiles = event.dataTransfer?.files || event.target.files;
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      const newFiles = Array.from(uploadedFiles).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }));

      setFiles(prev => ({
        ...prev,
        [section]: [...prev[section], ...newFiles]
      }));
    }
    setDragOver(null);
  };

  const handleLinkSubmit = (section) => {
    if (linkForm.url && linkForm.name) {
      const newLink = {
        id: Date.now(),
        name: linkForm.name,
        type: 'link',
        url: linkForm.url,
        uploadedAt: new Date().toISOString()
      };

      setFiles(prev => ({
        ...prev,
        [section]: [...prev[section], newLink]
      }));
      
      setLinkForm({ url: '', name: '' });
      setShowLinkForm(null);
    }
  };

  const handleLinkCancel = () => {
    setLinkForm({ url: '', name: '' });
    setShowLinkForm(null);
  };

  const handleDelete = (section, fileId) => {
    if (window.confirm('Delete this file?')) {
      setFiles(prev => ({
        ...prev,
        [section]: prev[section].filter(f => f.id !== fileId)
      }));
    }
  };

  const getFileIcon = (type) => {
    if (type === 'link') return '🔗';
    if (type?.includes('video')) return <Video className="w-5 h-5" />;
    if (type?.includes('image')) return <Image className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getFileThumbnail = (file) => {
    if (file.type === 'link') {
      // For links, show a full card preview
      return (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
          <div className="text-center">
            <span className="text-6xl mb-3 block">🔗</span>
            <span className="text-sm text-blue-600 font-medium">External Link</span>
          </div>
          {/* Title Overlay - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white font-semibold text-sm truncate">{file.name}</p>
            <p className="text-blue-200 text-xs truncate">{file.url}</p>
          </div>
        </div>
      );
    }    
    if (file.type?.includes('image')) {
      return (
        <div className="w-full h-48 relative overflow-hidden">
          <img 
            src={file.url} 
            alt={file.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{display: 'none'}}>
            <Image className="w-12 h-12 text-gray-400" />
          </div>
          {/* Title Overlay - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white font-semibold text-sm truncate">{file.name}</p>
            <p className="text-gray-200 text-xs">{formatFileSize(file.size)}</p>
          </div>
        </div>
      );
    }
      const fileUrl =
        typeof file === "string"
          ? file
          : file.url
          ? file.url
          : file instanceof Blob
          ? URL.createObjectURL(file)
          : null;
    
      if (!fileUrl) {
        return (
          <div className="w-full h-48 flex items-center justify-center text-gray-500 text-sm">
            Invalid file
          </div>
        );
      }
    
      if (file.type?.includes("pdf")) {
        return (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full bg-gray-900 flex items-center justify-center relative overflow-hidden"
              />
            ) : (
              <div className="text-gray-500">No thumbnail</div>
            )}
          </div>
      )}

    if (file.type?.includes('video')) {
      return (
        <div className="w-full h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden">
          <video 
            src={file.url} 
            className="w-full h-full object-cover"
            muted
            onLoadedData={(e) => {
              e.target.currentTime = 1; // Seek to 1 second for thumbnail
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          {/* Title Overlay - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white font-semibold text-sm truncate">{file.name}</p>
            <p className="text-gray-200 text-xs">{formatFileSize(file.size)}</p>
          </div>
        </div>
      );
    } 

    // For other file types, show icon
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
        <div className="text-center">
          {getFileIcon(file.type)}
          <span className="text-sm text-gray-500 font-medium mt-2 block">{file.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
        </div>
        {/* Title Overlay - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white font-semibold text-sm truncate">{file.name}</p>
          <p className="text-gray-200 text-xs">{formatFileSize(file.size)}</p>
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Map prompt text color classes to matching number circle colors
  const promptColorMap = {
    'text-blue-600': { bg: '#dbeafe', fg: '#2563eb' },   // blue-100 / blue-600
    'text-purple-600': { bg: '#f3e8ff', fg: '#9333ea' }, // purple-100 / purple-600
    'text-green-600': { bg: '#dcfce7', fg: '#16a34a' },  // green-100 / green-600
    'text-orange-600': { bg: '#ffedd5', fg: '#ea5800' }, // orange-100 / orange-600
    'text-teal-600': { bg: '#ccfbf1', fg: '#0d9488' }    // teal-100 / teal-600
  };

  const MediaUploadZone = ({ section, icon: Icon, title }) => (
    <div className="relative">
      {isAdmin && showLinkForm === section && (
        <div className="mb-4 p-4 bg-white border-2 border-blue-400 rounded-xl shadow-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Add External Link</h4>
          <div className="space-y-3">
            <input
              type="url"
              value={linkForm.url}
              onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/your-content"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={linkForm.name}
              onChange={(e) => setLinkForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Display name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleLinkSubmit(section)}
                disabled={!linkForm.url || !linkForm.name}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Link
              </button>
              <button
                onClick={handleLinkCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(section);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleFileUpload(section, e)}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-4 ${
            dragOver === section ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium text-gray-700 mb-1">Drop {title} here</p>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(section, e)}
            className="hidden"
            id={`upload-${section}`}
          />
          <div className="flex gap-2 justify-center mt-3">
            <label
              htmlFor={`upload-${section}`}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Browse Files
            </label>
            <button
              onClick={() => setShowLinkForm(showLinkForm === section ? null : section)}
              className="px-3 py-1.5 bg-white border border-blue-600 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-50"
            >
              Add Link
            </button>
          </div>
        </div>
      )}

      {files[section].length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files[section].map(file => (
            <div
              key={file.id}
              className="group relative bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer"
            >
              {/* Clickable Thumbnail */}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {getFileThumbnail(file)}
              </a>
              
              {/* Admin Delete Button - positioned absolutely */}
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(section, file.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎬</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Content Creation Workshop</h1>
                  <p className="text-sm text-gray-600 mt-0.5">Master the art of scroll-stopping content</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
          >
            </button>
          </div>
        </div>
      </div>
          
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-3">Welcome to the Workshop</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Everything you need to create content that captures attention, delivers value, and drives action — including the main presentation deck and frameworks from the session. 
              This is your living resource—use it, reference it, build on it.
              </p>

            {isAdmin && (
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-blue-50">
                  <strong>Admin Mode Active:</strong> You can upload slides, add example content, and manage all materials. 
                  Students will only see view/download options.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div>
            </div>
          </div>
          <MediaUploadZone section="slides" icon={File} title="slides" />
        </div>

        {File?.length > 0 && (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <Video className="w-8 h-8 text-green-500" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Example Content</h2>
        <p className="text-gray-600">
        Real examples we analysed—study these for pattern recognition
        </p>
      </div>
    </div>
    <MediaUploadZone section="examples" icon={Video} title="examples" />
  </div>
)}

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">The 3-Part Content Framework</h2>
              <p className="text-gray-600">Master these fundamentals and you'll never run out of ideas</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">HOOK</h3>
              <p className="text-gray-600 text-sm leading-relaxed hidden sm:block">
                Grab attention in the first 3 seconds. Make them stop mid-scroll. Pattern interrupt is your best friend. 
                No hook = no views.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">VALUE</h3>
              <p className="text-gray-600 text-sm leading-relaxed hidden sm:block">
                Deliver something useful, entertaining, or emotionally resonant. Answer "why should I care?" immediately. 
                Value = retention.
              </p>

            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CTA</h3>
              <p className="text-gray-600 text-sm leading-relaxed hidden sm:block">
                Tell them what to do next. No Call-to-Action = wasted opportunity. Be specific and make it frictionless. 
                Guide the next step.
              </p>
            </div>
            <p className="flex justify-center sm:hidden">
              </p>
             <p className="text-center text-sm text-gray-400 justify-center leading-relaxed mt-2 sm:hidden">
             Rotate Screen <RefreshCw className="inline w-4 h-4" />
          </p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <div className="flex gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibnpold text-gray-900 mb-2">Key Principle</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  People don't consume content—they consume <strong>emotions and outcomes</strong>. Your job is to deliver both, fast. 
                  Clarity beats cleverness. Specific beats generic. Show, don't tell. 
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Content Ideas & Formats</h2>
              <p className="text-gray-600">Your idea bank for when the blank page feels intimidating</p>
            </div>
          </div>

          {/* Venn Diagram with YOUR PNG */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-gray-700 mb-6">
            <div className="max-w-xl mx-auto">
              <h3 className="text-center text-lg font-bold text-white mb-6">The Three Pillars of Great Content</h3>
              <img 
                src="/venn-diagram.png" 
                alt="Three Pillars Venn Diagram" 
                className="w-full max-w-lg mx-auto"
              />
              <p className="text-center text-sm text-gray-300 mt-4">
                The best content lives at the intersection of all three. Teach something valuable, make it engaging to watch, and spark conversation.
              </p>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4 sm:hidden">
            <p className="text-center text-sm text-gray-400 leading-relaxed sm:hidden">
            Rotate Screen <RefreshCw className="inline w-4 h-4 ml-1" />
          </p>
          </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
  {/* Left column */}
  <ContentCategories />

  {/* Right column */}
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hidden sm:flex flex-col overflow-y-auto max-h-[1570px]">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 flex-shrink-0">
      <span className="text-2xl">💭</span>
      Ideation Prompts
    </h3>

    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-3">
                {[
                  // 💼 Authority & Expertise - Blue
                  { text: 'What did I believe 6 months ago that I now know is wrong?', color: 'text-blue-600' },
                  { text: 'What’s an unpopular opinion I hold that’s backed by data?', color: 'text-blue-600' },
                  { text: 'What process or tactic do I use that most people don’t know about?', color: 'text-blue-600' },
                  { text: 'What mistake cost me time or money that others should avoid?', color: 'text-blue-600' },
                  { text: 'What quick win changed everything for me and how?', color: 'text-blue-600' },
                  { text: 'What would a complete beginner need to know first?', color: 'text-blue-600' },
                  { text: 'What’s the one thing holding most people back from [goal]?', color: 'text-blue-600' },
                
                  // 🤓 Perspective & Personality - Purple
                  { text: 'Which beliefs did I have that I now challenge publicly?', color: 'text-purple-600' },
                  { text: 'What’s an unpopular perspective I hold that surprises people?', color: 'text-purple-600' },
                  { text: 'What personal story illustrates a key lesson in my journey?', color: 'text-purple-600' },
                  { text: 'What failure felt devastating at the time but taught me the most?', color: 'text-purple-600' },
                  { text: 'What contrarian take could spark conversation on a trending topic?', color: 'text-purple-600' },
                  { text: 'What do I love about this work that most people don’t see?', color: 'text-purple-600' },
                  { text: 'What assumption about me is completely wrong?', color: 'text-purple-600' },
                  { text: 'What belief do I hold that most peers actively reject?', color: 'text-purple-600' },
                
                  // 🎬 Behind the Curtain - Green
                  { text: 'What’s my actual daily workflow vs. what people assume?', color: 'text-green-600' },
                  { text: 'Which behind-the-scenes process drives the biggest impact?', color: 'text-green-600' },
                  { text: 'What small action no one notices has a huge effect?', color: 'text-green-600' },
                  { text: 'What fails or pivots do I never show publicly?', color: 'text-green-600' },
                  { text: 'How do I turn one idea into multiple pieces of content?', color: 'text-green-600' },
                  { text: 'Which routine or ritual sets up my most productive days?', color: 'text-green-600' },
                  { text: 'What behind-the-scenes moment revealed reality vs expectation?', color: 'text-green-600' },
                  { text: 'Which collaboration went completely differently than planned?', color: 'text-green-600' },
                
                  // 👥 Audience Collaboration - Orange
                  { text: 'What question does my audience ask most that I haven’t answered yet?', color: 'text-orange-600' },
                  { text: 'Which idea would my audience vote as most valuable?', color: 'text-orange-600' },
                  { text: 'What fan suggestion surprised me but worked brilliantly?', color: 'text-orange-600' },
                  { text: 'What debate or poll could spark meaningful conversation?', color: 'text-orange-600' },
                  { text: 'What follow-up content should I create from audience comments?', color: 'text-orange-600' },
                  { text: 'What interactive challenge could my community try with me?', color: 'text-orange-600' },
                  { text: 'Which misconception do people often comment about that I can clarify?', color: 'text-orange-600' },
                  { text: 'What story from a follower can I showcase to teach a lesson?', color: 'text-orange-600' },
                
                  // 🔁 Reinvention & Repurposing - Teal
                  { text: 'Which old content can I repurpose with a new spin?', color: 'text-teal-600' },
                  { text: 'What transformation or progress story deserves a revisit?', color: 'text-teal-600' },
                  { text: 'Which lessons learned could be turned into a short actionable guide?', color: 'text-teal-600' },
                  { text: 'What spin-off topics exist in my best-performing content?', color: 'text-teal-600' },
                  { text: 'What evergreen idea can I refresh for today’s audience?', color: 'text-teal-600' },
                  { text: 'Which failed experiments are worth sharing with a new perspective?', color: 'text-teal-600' },
                  { text: 'How can I update old advice with new data or experience?', color: 'text-teal-600' },
                  { text: 'Which behind-the-scenes clip can be turned into a lesson?', color: 'text-teal-600' }
                ].map((prompt, i) => {
                  const color = promptColorMap[prompt.color] || { bg: '#f3f4f6', fg: '#374151' };
                  return (
                    <li key={i} className="formats-item">
                      <div
                        className="formats-number"
                        style={{ background: color.bg, color: color.fg }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className={`formats-item-title2 ${prompt.color}`}>{prompt.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        </div>

 {/* AI Prompt Section */}
 <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🧠</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Content Prompt</h2>
              <p className="text-gray-600">Copy this prompt into ChatGPT or Claude to generate high-quality scripts</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <p className="text-white font-semibold">🧠 IMPROVED CONTENT PROMPT</p>
              <p className="text-purple-100 text-sm mt-1">Use this with any AI to generate scroll-stopping scripts</p>
            </div>
            
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 font-mono text-xs leading-relaxed text-gray-800 max-h-96 overflow-y-auto">
                <p className="font-bold text-sm mb-3 text-gray-900">Role</p>
                <p className="mb-4">You are not just a short-form scriptwriter — you are a modern story architect who writes for human attention in the algorithmic age. You understand pacing, tension, rhythm, and emotion — the levers that make people stop scrolling, keep watching, and feel something.</p>
                
                <p className="mb-4">You turn hooks into high-retention, story-driven short scripts for Reels, YouTube Shorts, or TikTok. Every script must feel conversational, authentic, and emotionally charged — like a friend sharing perspective, not a guru delivering advice.</p>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Mission</p>
                <p className="mb-2">Craft thumb-stopping, emotionally engaging short-form video scripts that:</p>
                <ol className="list-decimal ml-6 mb-4">
                  <li>Educate – deliver genuine value or insight</li>
                  <li>Relate – build connection, trust, or empathy</li>
                  <li>Elevate – grow the personal or brand narrative</li>
                </ol>
                <p className="mb-4">The specific type of video will be provided in the brief.</p>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Input You'll Receive</p>
                <ul className="list-disc ml-6 mb-4">
                  <li>A hook (which you may refine or reframe for maximum curiosity)</li>
                  <li>A video idea, theme, or story</li>
                  <li>Optionally, a draft script for you to optimise</li>
                </ul>
                <p className="mb-4">Your task: expand or reconstruct that input into a scroll-stopping, emotionally layered, rhythmically written script capable of going viral for the right reasons.</p>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Core Writing Principles</p>
                <ul className="list-disc ml-6 mb-4 space-y-1">
                  <li>Open strong. Lead with curiosity, contradiction, or emotional tension.</li>
                  <li>Sound human. Write how people talk — raw, conversational, and punchy.</li>
                  <li>Control rhythm. Short sentences for impact. Longer ones for storytelling flow. Pauses for emphasis.</li>
                  <li>Use the "But/Therefore" rule. Each line should cause the next. (e.g. "He wanted X, but...", "She believed Y, therefore...")</li>
                  <li>Build emotional arcs. Curiosity → Tension → Surprise → Relief or Insight.</li>
                  <li>Delay resolution. Don't give away the answer too early — tease, build, and then reward.</li>
                  <li>Rehook every 3–5 seconds. Reset attention with new emotion, idea, or perspective.</li>
                  <li>Prioritise retention over reaction. The goal isn't views — it's impact and memory.</li>
                </ul>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Tone & Voice</p>
                <p className="mb-2">Authentic. Conversational. Self-aware. Slightly cinematic.</p>
                <p className="mb-2">Avoid clichés and over-hyped "guru talk".</p>
                <p className="mb-1">Think:</p>
                <p className="italic mb-1">"This actually changed how I see things..."</p>
                <p className="mb-1">Not:</p>
                <p className="italic mb-4">"Here's how to 10× your life in 3 easy steps."</p>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Output Format</p>
                <p className="mb-2">When producing a script, include:</p>
                <ol className="list-decimal ml-6 mb-4">
                  <li>Optimised Hook (if applicable) with 2 alternatives</li>
                  <li>Full Script (30–60 seconds unless otherwise stated)</li>
                  <li>Beat Notes – optional guidance on pacing, emphasis, or visual moments</li>
                </ol>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Bonus Behaviour</p>
                <p className="mb-4">If the idea or hook feels weak, predictable, or overused — challenge it. Suggest stronger angles or alternative framings before writing. You are both storyteller and strategist — your purpose is not just to write, but to make the content unignorable.</p>

                <p className="font-bold text-sm mb-3 text-gray-900 mt-6">Meta-Guidance (for LLM behaviour)</p>
                <ul className="list-disc ml-6 mb-4 space-y-1">
                  <li>Prioritise narrative structure over generic formatting.</li>
                  <li>Write with visual subtext — each line should imply a shot, feeling, or shift.</li>
                  <li>Avoid filler, fluff, and listicle-style narration.</li>
                  <li>When in doubt, ask: "Would this make someone stop scrolling?" If not, rewrite until it does.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-gray-200">
              <p className="text-sm text-gray-600">Click the button to copy this entire prompt →</p>
              <button
                onClick={() => {
                  const promptText = `Role

You are not just a short-form scriptwriter — you are a modern story architect who writes for human attention in the algorithmic age. You understand pacing, tension, rhythm, and emotion — the levers that make people stop scrolling, keep watching, and feel something.

You turn hooks into high-retention, story-driven short scripts for Reels, YouTube Shorts, or TikTok. Every script must feel conversational, authentic, and emotionally charged — like a friend sharing perspective, not a guru delivering advice.

Mission

Craft thumb-stopping, emotionally engaging short-form video scripts that:

1. Educate – deliver genuine value or insight
2. Relate – build connection, trust, or empathy
3. Elevate – grow the personal or brand narrative

The specific type of video will be provided in the brief.

Input You'll Receive

- A hook (which you may refine or reframe for maximum curiosity)
- A video idea, theme, or story
- Optionally, a draft script for you to optimise

Your task: expand or reconstruct that input into a scroll-stopping, emotionally layered, rhythmically written script capable of going viral for the right reasons.

Core Writing Principles

- Open strong. Lead with curiosity, contradiction, or emotional tension.
- Sound human. Write how people talk — raw, conversational, and punchy.
- Control rhythm. Short sentences for impact. Longer ones for storytelling flow. Pauses for emphasis.
- Use the "But/Therefore" rule. Each line should cause the next. (e.g. "He wanted X, but...", "She believed Y, therefore...")
- Build emotional arcs. Curiosity → Tension → Surprise → Relief or Insight.
- Delay resolution. Don't give away the answer too early — tease, build, and then reward.
- Rehook every 3–5 seconds. Reset attention with new emotion, idea, or perspective.
- Prioritise retention over reaction. The goal isn't views — it's impact and memory.

Tone & Voice

Authentic. Conversational. Self-aware. Slightly cinematic.
Avoid clichés and over-hyped "guru talk".

Think:
"This actually changed how I see things..."
Not:
"Here's how to 10× your life in 3 easy steps."

Output Format

When producing a script, include:

1. Optimised Hook (if applicable) with 2 alternatives
2. Full Script (30–60 seconds unless otherwise stated)
3. Beat Notes – optional guidance on pacing, emphasis, or visual moments

Bonus Behaviour

If the idea or hook feels weak, predictable, or overused — challenge it. Suggest stronger angles or alternative framings before writing. You are both storyteller and strategist — your purpose is not just to write, but to make the content unignorable.

Meta-Guidance (for LLM behaviour)

- Prioritise narrative structure over generic formatting.
- Write with visual subtext — each line should imply a shot, feeling, or shift.
- Avoid filler, fluff, and listicle-style narration.
- When in doubt, ask: "Would this make someone stop scrolling?" If not, rewrite until it does.`;
                  navigator.clipboard.writeText(promptText);
                  alert('✅ Prompt copied to clipboard! Paste it into ChatGPT or Claude.');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
              >
                📋 Copy Prompt
              </button>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-900">💡 Pro Tip:</strong> After pasting this prompt into your AI, follow up with: 
              <em className="block mt-2 text-gray-600">"Here's my hook: [your hook]. The story is about: [brief description]. Write me a 45-second script."</em>
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-red-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Video Hook Library</h2>
              <p className="text-gray-600">Hook formulas and examples that stop the scroll</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎣</span>
              Hook Formulas That Work
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'The Mistake Hook', example: '"I wasted £10K on [X] so you don\'t have to"' },
                { name: 'The Results Hook', example: '"Here\'s how I [specific result] in [timeframe]"' },
                { name: 'The Secret Hook', example: '"Nobody talks about this [thing], but it changed everything"' },
                { name: 'The Challenge Hook', example: '"Stop doing [common thing]. Here\'s what to do instead"' },
                { name: 'The Curiosity Hook', example: '"The reason [X] isn\'t working for you"' },
                { name: 'The Story Hook', example: '"Three months ago I was [bad situation]..."' },
                { name: 'The Direct Hook', example:'"Here\'s the harsh truth: your first 50 videos won\'t make you famous. They\'ll make you consistent — and that\'s what matters."'},
                { name: 'The Reflection Hook', example: '"I wish someone told me this before I started creating content..."'},
                { name: 'The Contrarian Hook', example: '"Everyone says ‘just start.’ I say — don’t start until you understand this."',},
                {name: 'The Statistic Hook', example: '"85% of creators burn out within their first year. I nearly became one of them — until I changed this."'},
              ].map((hook, i) => (
                <div key={i} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{hook.name}</p>
                  <p className="text-xs text-gray-600 italic">{hook.example}</p>
                </div>
              ))}
            </div>
          </div>

          <MediaUploadZone section="hooks" icon={Play} title="hook videos" />
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">✅ Your Action Plan</h2>
          <p className="text-purple-100 mb-6 leading-relaxed">
            Don't let this become another tab you bookmark and forget. Here's what to do next:
          </p>
          <ol className="space-y-3 mb-6">
            {[
              'Pick ONE content format from this framework',
              'Write 3 hooks using the formulas above',
              'Create your first piece of content within 48 hours',
              'Post it and analyse what worked (and what didn\'t)',
              'Iterate and repeat weekly'
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="pt-0.5 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="font-semibold text-lg">🔥 Remember:</p>
            <p className="text-purple-100 text-sm mt-1">
              Good content posted is better than perfect content planned. Ship it, learn from it, improve it. 
              <strong className="text-white"> Momentum beats perfection.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}