import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/923222520101?text=Hello%20Al-Noor%20Collection!%20I%20am%20interested%20in%20your%20products.', '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 animate-bounce hover:animate-none group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Pulse Animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
    </button>
  );
};

export default WhatsAppFloat;
