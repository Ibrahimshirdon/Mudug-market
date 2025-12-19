import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const Toast = () => {
    const { toast, hideToast } = useToast();

    if (!toast.isVisible) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] animate-slideDown">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
                isSuccess 
                    ? 'bg-white border-green-100 text-gray-800' 
                    : 'bg-white border-red-100 text-gray-800'
            }`}>
                <div className={`p-2 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isSuccess ? (
                        <FaCheckCircle className="text-xl text-green-600" />
                    ) : (
                        <FaExclamationCircle className="text-xl text-red-600" />
                    )}
                </div>
                
                <div className="flex-1 min-w-[200px]">
                    <h4 className={`font-bold text-sm ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                        {isSuccess ? 'Success' : 'Error'}
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">
                        {toast.message}
                    </p>
                </div>

                <button 
                    onClick={hideToast}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default Toast;
