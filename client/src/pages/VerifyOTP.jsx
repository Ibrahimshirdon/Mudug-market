import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api.config';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaEnvelope, FaRedo } from 'react-icons/fa';

const VerifyOTP = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email');

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (!email) {
            navigate('/register');
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/verify-otp`, {
                email,
                code
            });
            toast.success(data.message);
            // Auto login logic if token returned
            if (data.token) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                window.location.href = '/';
            } else {
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setResending(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
            toast.success(data.message);
            setTimer(60);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full glass-primary rounded-3xl shadow-2xl relative z-10 overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-8 text-center relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <FaShieldAlt className="text-4xl text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white">Verification</h2>
                        <p className="text-primary-100 mt-2">Check your email for the code</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <FaEnvelope className="text-primary-500 text-xl" />
                        <div>
                            <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Email Sent To</p>
                            <p className="text-gray-900 font-medium truncate">{email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">6-Digit Code</label>
                            <input
                                required
                                type="text"
                                maxLength="6"
                                className="w-full text-center text-3xl font-black tracking-[1rem] p-4 bg-white border-2 border-primary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-200"
                                placeholder="000000"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 active:scale-95 transition-all shadow-xl shadow-primary-500/30 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Verify Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-slate-500 mb-3">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={timer > 0 || resending}
                            className={`flex items-center gap-2 mx-auto font-bold transition-all ${timer > 0 ? 'text-slate-300' : 'text-primary-600 hover:text-primary-700 active:scale-95'
                                }`}
                        >
                            <FaRedo className={`${resending ? 'animate-spin' : ''}`} />
                            {resending ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend Code Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
