import React, { useState } from 'react';
import {
  Code,
  Sparkles,
  Copy,
  Check,
  Globe,
  Bot,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { crmStore } from '@/lib/store';
import { Tenant } from '@/lib/types';
import { toast } from '@/lib/toast';

export const WidgetBuilderModule: React.FC = () => {
  const [tenant] = useState<Tenant>(crmStore.getActiveTenant());
  const [botName, setBotName] = useState('DigitalX AI Assistant');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can our AI Voice & Automation team help you today?');
  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor || '#4f46e5');
  const [isCopied, setIsCopied] = useState(false);

  // Live preview state
  const [isPreviewChatOpen, setIsPreviewChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: welcomeMessage },
  ]);
  const [userInput, setUserInput] = useState('');

  const snippetCode = `<!-- DigitalX Embeddable AI Voice & Chatbot Widget -->
<script
  src="https://digitalx-enterprise-crm.vercel.app/widget.js"
  data-widget-key="${tenant.widgetKey}"
  data-bot-name="${botName}"
  data-[#primary-color]="${primaryColor}"
  async>
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippetCode);
    setIsCopied(true);
    toast.success('Snippet Copied', 'Embeddable widget script copied to clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSendPreviewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setUserInput('');

    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thanks for reaching out! I can schedule an instant AI Voice Call demo for your business. May I have your phone number?`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-card p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" /> Self-Serve Embeddable Widget Generator
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            White-Label Website Voice & Chat Widget Builder
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Embed an AI Voice & Lead Capture widget on your or your clients' websites with rate-limited public API keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Public Key: {tenant.widgetKey}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="crm-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" /> Widget Customization
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">AI Bot Name</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Welcome Message</label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => {
                    setWelcomeMessage(e.target.value);
                    setChatMessages([{ sender: 'bot', text: e.target.value }]);
                  }}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <span className="font-mono text-slate-700 font-bold">{primaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="crm-card p-6 rounded-2xl space-y-3 bg-slate-900 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4" /> Embeddable JavaScript Code
              </span>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {snippetCode}
            </pre>
            <p className="text-[11px] text-slate-400">
              Paste this snippet before the <code>&lt;/body&gt;</code> tag on any website to render the widget.
            </p>
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="crm-card p-6 rounded-2xl space-y-4 bg-slate-100 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" /> Live Website Preview Window
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Rate-Limited Public Key Active
              </span>
            </div>

            {/* Mock website content background */}
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-slate-400 space-y-2">
              <Bot className="w-12 h-12 text-slate-300" />
              <h4 className="font-bold text-sm text-slate-600">Your Buyer's Website Header</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                The widget button stays fixed in the bottom right corner of your client's website.
              </p>
            </div>

            {/* Floating Widget Button Preview */}
            <div className="absolute bottom-6 right-6">
              {isPreviewChatOpen ? (
                <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-3 text-white flex items-center justify-between font-bold text-xs" style={{ backgroundColor: primaryColor }}>
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>{botName}</span>
                    </div>
                    <button onClick={() => setIsPreviewChatOpen(false)} className="hover:opacity-80">✕</button>
                  </div>

                  <div className="p-3 h-64 overflow-y-auto space-y-2 text-xs bg-slate-50">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2.5 rounded-xl max-w-[80%] ${
                          msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendPreviewMessage} className="p-2 border-t flex gap-1 bg-white">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none"
                    />
                    <button type="submit" className="px-3 py-1.5 rounded-xl text-white font-bold text-xs" style={{ backgroundColor: primaryColor }}>
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsPreviewChatOpen(true)}
                  className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all transform hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
