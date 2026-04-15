import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Search, ArrowRight, BookOpen, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  results?: any[];
  isAi?: boolean;
}

interface SearchAgentProps {
  isOpen: boolean;
  onClose: () => void;
  allNodes: any[];
  onSelectResult: (nodeName: string, type?: string, parentName?: string) => void;
}

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'null') return null;
  return key;
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const SearchAgent: React.FC<SearchAgentProps> = ({ isOpen, onClose, allNodes, onSelectResult }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Google Maps Platform assistant. I can help you find information across our Products, Documentation, and Pricing categories. What are you looking for today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const query = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      let enhancedResults: any[] = [];
      let response = "";
      let isAiResponse = false;

      if (ai) {
        // Prepare a list of products, use cases, and industries for the AI to choose from
        const productList = allNodes
          .filter(n => n.type === 'product' || n.type === 'info')
          .map(n => n.name)
          .filter((v, i, a) => a.indexOf(v) === i) // Unique names
          .join(', ');

        const solutionsNodes = allNodes.filter(n => {
          let curr = n;
          while (curr) {
            if (curr.name === 'Solutions') return true;
            curr = curr.parent;
          }
          return false;
        });

        const useCases = solutionsNodes
          .filter(n => n.parent?.name === 'Use Cases')
          .map(n => n.name)
          .filter((v, i, a) => a.indexOf(v) === i) // Unique names
          .join(', ');

        const industries = solutionsNodes
          .filter(n => n.parent?.name === 'Industries')
          .map(n => n.name)
          .filter((v, i, a) => a.indexOf(v) === i) // Unique names
          .join(', ');

        const prompt = `
          You are a Google Maps Platform expert. A user is asking: "${query}"
          
          Our catalog includes:
          Products: [${productList}]
          Use Cases: [${useCases}]
          Industries: [${industries}]
          
          1. Identify the top 3-5 most relevant items (Products, Use Cases, or Industries) that match the user's intent.
          2. Provide a brief, helpful explanation of why these items are relevant to their specific need.
          3. Format your response as a JSON object with two fields:
             "explanation": "A concise 1-2 sentence explanation of the recommendations."
             "matches": ["Item Name 1", "Item Name 2", ...]
          
          If the query is generic (e.g., "pricing", "docs"), prioritize those categories.
          If the query matches a specific Industry or Use Case, prioritize those.
          If no items match, return an empty matches array.
        `;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                explanation: { type: Type.STRING },
                matches: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["explanation", "matches"]
            }
          }
        });

        const text = result.text;
        console.log("AI Raw Response:", text);
        
        try {
          const parsed = JSON.parse(text || '{}');
          
          response = parsed.explanation;
          isAiResponse = true;

          // Map the names back to node objects with better fuzzy matching
          enhancedResults = (parsed.matches || []).map((name: string) => {
            const searchName = name.toLowerCase().trim();
            // Try exact match first
            let node = allNodes.find(n => n.name.toLowerCase() === searchName);
            
            // Try fuzzy match if exact fails
            if (!node) {
              node = allNodes.find(n => 
                (n.type === 'product' || n.type === 'info' || n.type === 'category') && 
                (n.name.toLowerCase().includes(searchName) || searchName.includes(n.name.toLowerCase()))
              );
            }

            if (!node) return null;

            const related: { docs?: any, pricing?: any } = {};
            const findRelated = (n: any) => {
              const children = n.children || n._children;
              if (children) {
                children.forEach((child: any) => {
                  // Capture documentation nodes by type or name
                  const cName = child.name.toLowerCase();
                  if ((child.type === 'docs' || cName.includes('documentation')) && !related.docs) {
                    related.docs = child;
                  }
                  // Prioritize "Pricing Calculator" for the pricing link as requested
                  if ((child.type === 'pricing' || cName.includes('pricing calculator')) && !related.pricing) {
                    related.pricing = child;
                  }
                  findRelated(child);
                });
              }
            };
            findRelated(node);
            return { ...node, related };
          }).filter(Boolean);

        } catch (e) {
          console.error("Failed to parse AI response:", e);
        }
      }

      // Fallback to simple search if AI is unavailable or failed
      if (enhancedResults.length === 0) {
        const simpleQuery = query.toLowerCase();
        const results = allNodes.filter(node => 
          node.name.toLowerCase().includes(simpleQuery) && 
          node.type !== 'root' &&
          node.type !== 'search'
        ).slice(0, 10);

          enhancedResults = results.map(node => {
            const related: { docs?: any, pricing?: any } = {};
            const findRelated = (n: any) => {
              const children = n.children || n._children;
              if (children) {
                children.forEach((child: any) => {
                  // Capture documentation nodes by type or name
                  const cName = child.name.toLowerCase();
                  if ((child.type === 'docs' || cName.includes('documentation')) && !related.docs) {
                    related.docs = child;
                  }
                  // Prioritize "Pricing Calculator" for the pricing link as requested
                  if ((child.type === 'pricing' || cName.includes('pricing calculator')) && !related.pricing) {
                    related.pricing = child;
                  }
                  findRelated(child);
                });
              }
            };
            findRelated(node);
            return { ...node, related };
          });

        if (enhancedResults.length > 0) {
          if (simpleQuery.includes('product')) {
            response = `I found several items in our Products category. You can see the full list below.`;
          } else if (simpleQuery.includes('doc')) {
            response = `Here are the relevant Documentation resources I found for you.`;
          } else if (simpleQuery.includes('price') || simpleQuery.includes('pricing')) {
            response = `I've located the Pricing information you requested. We offer flexible plans including a $200 monthly credit.`;
          } else {
            response = `I found ${enhancedResults.length} relevant items for "${query}".`;
          }
        } else {
          response = `I couldn't find anything specific for "${query}". Try searching for a product name, "documentation", or "pricing" to see more options.`;
        }
      }

      // Remove duplicates by name to ensure a clean result list
      const uniqueResults = enhancedResults.filter((v, i, a) => 
        a.findIndex(t => t.name === v.name) === i
      );

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        results: uniqueResults.length > 0 ? uniqueResults : undefined,
        isAi: isAiResponse
      }]);
    } catch (error) {
      console.error("Search error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while searching. Please try again with a simpler query." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-google-blue text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Maps Search Agent</h3>
                <p className="text-xs text-white/70">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-google-blue text-white' : 'bg-white border border-gray-200 text-google-blue shadow-sm'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-2xl shadow-sm relative ${
                      msg.role === 'user' 
                        ? 'bg-google-blue text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.role === 'assistant' && msg.isAi && (
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2 h-2" /> AI POWERED
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    
                    {msg.results && (
                      <div className="grid grid-cols-1 gap-3">
                        {msg.results.map((result, rIdx) => (
                          <div key={rIdx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-google-blue transition-all group">
                            <button
                              onClick={() => onSelectResult(result.name, result.type)}
                              className="w-full flex items-center justify-between p-3 hover:bg-blue-50/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  result.type === 'product' ? 'bg-google-green' : 
                                  result.type === 'category' ? 'bg-black' :
                                  'bg-google-blue'
                                }`} />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-google-blue">
                                  {result.name}
                                  <span className="text-[10px] text-gray-400 font-normal ml-2 uppercase tracking-wider">
                                    ({
                                      [
                                        "build interactive experiences", "display the ideal location", "enable asset tracking",
                                        "enrich transactions", "improve addresses", "offer efficient routes",
                                        "provide local information", "visualize geospatial data", "explore & select sites",
                                        "analyze geospatial data", "collaborate & share", "ground ai responses"
                                      ].includes(result.name.toLowerCase()) ? 'Use Case' :
                                      [
                                        "financial industries", "retail", "real estate", "transportation & logistics"
                                      ].includes(result.name.toLowerCase()) ? 'Industry' :
                                      result.type === 'info' || result.type === 'product' ? 'Product' : 
                                      result.type === 'docs' ? 'Documentation' : 
                                      result.type === 'pricing' ? 'Pricing' : 
                                      result.type.charAt(0).toUpperCase() + result.type.slice(1)
                                    })
                                  </span>
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-google-blue group-hover:translate-x-1 transition-all" />
                            </button>
                            
                            {(result.related?.docs || result.related?.pricing) && (
                              <div className="flex border-t border-gray-100 bg-gray-50/50">
                                {result.related.docs && (
                                  <button
                                    onClick={() => onSelectResult(result.related.docs.name, result.related.docs.type, result.name)}
                                    className="flex-1 py-2 px-3 text-[11px] font-medium text-google-blue hover:bg-google-blue hover:text-white transition-all border-r border-gray-100 flex items-center justify-center gap-1.5"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    Documentation
                                  </button>
                                )}
                                {result.related.pricing && (
                                  <button
                                    onClick={() => onSelectResult(result.related.pricing.name, result.related.pricing.type, result.name)}
                                    className="flex-1 py-2 px-3 text-[11px] font-medium text-google-green hover:bg-google-green hover:text-white transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    Pricing
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white border border-gray-200 text-google-blue shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <Loader2 className="w-4 h-4 text-google-blue animate-spin" />
                    <span className="text-xs text-gray-400 font-medium">Agent is searching...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask me anything about Google Maps Platform..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-google-blue text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-widest">
              Powered by Google Maps Platform Intelligence
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
