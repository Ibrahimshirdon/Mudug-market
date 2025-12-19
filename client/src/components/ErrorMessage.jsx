import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ErrorMessage = ({ message, type = 'inline', onRetry }) => {
    if (!message) return null;

    if (type === 'full') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn p-4">
                <div className="bg-red-50 p-8 rounded-3xl text-center max-w-md w-full border border-red-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-3xl text-red-500" />
                    </div>
                    <h3 className="text-xl text-gray-900 font-bold mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Inline Style (for forms)
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 flex items-start gap-3 animate-fadeIn">
            <FaInfoCircle className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-sm text-red-700 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage;
