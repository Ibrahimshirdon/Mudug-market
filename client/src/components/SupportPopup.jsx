import { useState } from 'react';
import { FaHeadset, FaWhatsapp, FaPhone, FaEnvelope, FaTimes, FaCommentDots } from 'react-icons/fa';

const SupportPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Modal / Popup Content */}
            {isOpen && (
                <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 animate-fadeIn origin-bottom-right">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">How can we help? 👋</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <a
                            href="https://wa.me/252666251592"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                <FaWhatsapp className="text-xl" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">WhatsApp Support</p>
                                <p className="text-xs text-gray-500">Chat with us instantly</p>
                            </div>
                        </a>

                        <a
                            href="tel:+252666251592"
                            className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                <FaPhone className="text-xl" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Call Us</p>
                                <p className="text-xs text-gray-500">+252 66 625 1592</p>
                            </div>
                        </a>

                        <a
                            href="mailto:ibra090shirdon@gmail.com"
                            className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                <FaEnvelope className="text-xl" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Send Email</p>
                                <p className="text-xs text-gray-500">ibra090shirdon@gmail.com</p>
                            </div>
                        </a>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">We typically reply within minutes!</p>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={togglePopup}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen
                        ? 'bg-gray-200 text-gray-600 rotate-90'
                        : 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-primary-500/30'
                    }`}
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-2xl animate-pulse-slow" />}
            </button>
        </div>
    );
};

export default SupportPopup;
