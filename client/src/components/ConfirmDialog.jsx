import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    const typeStyles = {
        info: {
            icon: FaCheckCircle,
            iconColor: 'text-blue-500',
            bgGradient: 'from-blue-500 to-blue-600',
            buttonBg: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-500/50',
        },
        warning: {
            icon: FaExclamationTriangle,
            iconColor: 'text-orange-500',
            bgGradient: 'from-orange-500 to-orange-600',
            buttonBg: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:shadow-orange-500/50',
        },
        success: {
            icon: FaCheckCircle,
            iconColor: 'text-green-500',
            bgGradient: 'from-green-500 to-green-600',
            buttonBg: 'bg-gradient-to-r from-green-600 to-green-700 hover:shadow-green-500/50',
        },
    };

    const style = typeStyles[type] || typeStyles.info;
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${style.bgGradient} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                            <Icon className="text-2xl text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-shadow">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                        >
                            <FaTimes className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3.5 ${style.buttonBg} text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
