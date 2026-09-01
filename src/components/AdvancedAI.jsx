import React, { useState } from 'react';
import { Brain, MessageSquare, Send, X, Sparkles, HelpCircle, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aiCapabilities = [
  { icon: <TrendingUp size={18} />, text: 'Demand forecasting' },
  { icon: <AlertTriangle size={18} />, text: 'Risk detection' },
  { icon: <CheckCircle size={18} />, text: 'Order optimization' },
  { icon: <HelpCircle size={18} />, text: '24/7 Support' },
];

const quickQuestions = [
  "What's my current order status?",
  "Predict demand for tomorrow",
  "Optimize delivery routes",
  "Water quality report",
  "Revenue analysis",
  "Driver performance",
];

export function AdvancedAIAssistant({ role, showNotice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      from: 'ai', 
      text: `Hello! I'm AquaAI, your intelligent assistant. I can help you with demand forecasting, route optimization, water quality monitoring, financial insights, and operational recommendations. What would you like to explore?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateAIResponse = (question) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('order') || lowerQ.includes('status')) {
      return {
        text: `Based on real-time data, you have 3 active orders:\n• AQ-1051: En Route (ETA 18 min)\n• AQ-1052: Confirmed (Processing)\n• AQ-1053: Scheduled (Tomorrow 09:00)\n\nAll orders are on track. Would you like me to provide detailed tracking for any specific order?`,
        suggestions: ['Track AQ-1051', 'View all orders', 'Contact driver']
      };
    }
    
    if (lowerQ.includes('demand') || lowerQ.includes('forecast') || lowerQ.includes('predict')) {
      return {
        text: `📊 Demand Forecast for Tomorrow:\n\nPeak Hours: 08:00-12:00 (92% capacity)\nHigh Demand Zones: East Legon, Osu\nRecommended Action: Deploy 3 additional trucks\n\nConfidence Score: 87% based on historical patterns, weather forecast, and local events.`,
        suggestions: ['View detailed forecast', 'Schedule extra trucks', 'Set alerts']
      };
    }
    
    if (lowerQ.includes('route') || lowerQ.includes('optimize') || lowerQ.includes('delivery')) {
      return {
        text: `🚛 Route Optimization Analysis:\n\nCurrent Routes: 12 active\nOptimization Opportunity: 23% fuel savings\nRecommended Changes:\n• Merge routes R-003 & R-007\n• Reorder stops for R-005\n• Pre-position truck at East Legon hub\n\nEstimated Savings: GH₵340/day`,
        suggestions: ['Apply optimizations', 'View route map', 'Calculate savings']
      };
    }
    
    if (lowerQ.includes('quality') || lowerQ.includes('water') || lowerQ.includes('report')) {
      return {
        text: `💧 Water Quality Report - All Facilities:\n\npH Level: 7.2 ✓ (Optimal: 6.5-8.5)\nTurbidity: 0.8 NTU ✓ (<5 NTU)\nTDS: 180 ppm ✓ (50-500 ppm)\nChlorine: 0.4 mg/L ✓ (0.2-2.0 mg/L)\n\nStatus: ALL SYSTEMS OPTIMAL\nLast updated: 15 minutes ago`,
        suggestions: ['Download certificate', 'View trends', 'Set quality alerts']
      };
    }
    
    if (lowerQ.includes('revenue') || lowerQ.includes('financial') || lowerQ.includes('money')) {
      return {
        text: `💰 Financial Overview (Last 30 Days):\n\nTotal Revenue: GH₵28,900 (+18.2%)\nOperating Costs: GH₵15,800\nNet Profit: GH₵13,100\nProfit Margin: 45.3%\n\nTop Revenue Zone: East Legon (35%)\nRecommendation: Expand capacity in Osu area`,
        suggestions: ['Detailed P&L', 'Zone comparison', 'Export report']
      };
    }
    
    if (lowerQ.includes('driver') || lowerQ.includes('performance')) {
      return {
        text: `👥 Driver Performance Summary:\n\nTop Performers:\n1. Kojo M. - 98% on-time, 4.9★\n2. Ama S. - 96% on-time, 4.8★\n3. Grace O. - 95% on-time, 4.8★\n\nAttention Needed:\n• Ibrahim K. - 87% on-time (training recommended)\n\nFleet Average: 94.2% on-time rate`,
        suggestions: ['View all drivers', 'Schedule training', 'Reward top performers']
      };
    }
    
    if (lowerQ.includes('alert') || lowerQ.includes('warning') || lowerQ.includes('risk')) {
      return {
        text: `⚠️ Active Alerts & Recommendations:\n\nHIGH PRIORITY:\n• Truck #AQ-402 needs maintenance (due today)\n• Supply gap predicted at 12:00 (15% shortage)\n\nMEDIUM PRIORITY:\n• Driver shortage in Tema zone (tomorrow)\n• Fuel price increase expected (+8%)\n\nRecommended Actions: 3 pending`,
        suggestions: ['Address all alerts', 'Maintenance schedule', 'Emergency protocols']
      };
    }
    
    // Default response
    return {
      text: `I can help you with:\n\n📈 Analytics: Demand forecasting, revenue analysis, performance metrics\n🚚 Operations: Route optimization, fleet management, delivery tracking\n💧 Quality: Water quality monitoring, compliance reports\n⚠️ Alerts: Risk detection, maintenance schedules, supply warnings\n\nWhat specific area would you like to explore?`,
      suggestions: ['Show analytics', 'Operations overview', 'Quality report', 'Active alerts']
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      from: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateAIResponse(input);
      const aiMessage = {
        id: messages.length + 2,
        from: 'ai',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <motion.button
          className="ai-float-button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Brain size={24} />
          <span className="pulse-ring"></span>
        </motion.button>
      )}

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-assistant-panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="ai-header">
              <div className="ai-title">
                <Brain size={24} color="#0088FE" />
                <div>
                  <h3>AquaAI Assistant</h3>
                  <small>Intelligent operations support</small>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="ai-capabilities">
              {aiCapabilities.map((cap, index) => (
                <motion.div
                  key={index}
                  className="capability-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {cap.icon}
                  <span>{cap.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="ai-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.from}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    {message.from === 'ai' ? (
                      <Sparkles size={20} color="#0088FE" />
                    ) : (
                      <div className="user-avatar">You</div>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    {message.suggestions && (
                      <div className="message-suggestions">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleQuickQuestion(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="message ai typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-avatar">
                    <Sparkles size={20} color="#0088FE" />
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="quick-questions">
              <MessageSquare size={16} />
              <span>Quick questions:</span>
              <div className="questions-scroll">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="question-chip"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your operations..."
              />
              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdvancedAIAssistant;
