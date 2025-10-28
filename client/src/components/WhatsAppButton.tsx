import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showTooltip?: boolean;
}

export function WhatsAppButton({ 
  phoneNumber = "923264747914",
  message = "Hello! I'm interested in your services.",
  position = 'bottom-right',
  showTooltip = true
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Main WhatsApp Button */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-[9999] select-none`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1 
        }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && showTooltipState && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: position === 'bottom-right' ? 20 : -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position === 'bottom-right' ? 20 : -20, scale: 0.8 }}
              className={`absolute bottom-16 ${position === 'bottom-right' ? 'right-0' : 'left-0'} mb-2`}
            >
              <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap">
                <div className="text-sm font-medium">Need help?</div>
                <div className="text-xs text-gray-600">Chat with us on WhatsApp!</div>
                <div 
                  className={`absolute top-full ${position === 'bottom-right' ? 'right-4' : 'left-4'} border-4 border-transparent border-t-white`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className={`absolute bottom-16 ${position === 'bottom-right' ? 'right-0' : 'left-0'} bg-white rounded-2xl shadow-xl border border-gray-200 p-4 min-w-[280px]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">WhatsApp Chat</div>
                    <div className="text-sm text-gray-600">We're online now!</div>
                  </div>
                </div>
                <button
                  onClick={toggleExpanded}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
                
                <div className="text-xs text-gray-500 text-center">
                  Click to open WhatsApp and start chatting with us
                </div>
              </div>

              {/* Arrow pointing to button */}
              <div 
                className={`absolute top-full ${position === 'bottom-right' ? 'right-6' : 'left-6'} border-8 border-transparent border-t-white`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={isExpanded ? toggleExpanded : handleClick}
          onMouseEnter={() => {
            setIsHovered(true);
            setShowTooltipState(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setTimeout(() => setShowTooltipState(false), 300);
          }}
          className="whatsapp-cursor relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isHovered 
              ? "0 20px 40px rgba(34, 197, 94, 0.4)" 
              : "0 10px 25px rgba(34, 197, 94, 0.3)"
          }}
        >
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ 
              scale: isHovered ? [0, 1.5] : 0,
              opacity: isHovered ? [0.3, 0] : 0
            }}
            transition={{ 
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut"
            }}
          />

          {/* WhatsApp Icon */}
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="w-8 h-8 text-white relative z-10" />
          </motion.div>

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 border-2 border-green-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white text-xs font-bold">1</span>
          </motion.div>
        </motion.button>

        {/* Online status indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      </motion.div>

      {/* Background overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-10 z-[9998]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
