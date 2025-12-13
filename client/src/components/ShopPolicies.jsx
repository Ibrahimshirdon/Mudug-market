import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';

const ShopPolicies = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                        📋 Platform Policies & Subscription Fee
                    </h3>
                    <div className="bg-white rounded-lg p-4 mb-3 border-2 border-blue-300">
                        <p className="text-2xl font-bold text-blue-600 mb-1">$10/month</p>
                        <p className="text-sm text-gray-600">Monthly subscription to operate your shop</p>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
                    >
                        {isExpanded ? (
                            <>
                                <FaChevronUp /> Hide Full Policies
                            </>
                        ) : (
                            <>
                                <FaChevronDown /> Read Full Policies
                            </>
                        )}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-white rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-blue-100">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Subscription Terms
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Monthly fee: $10 USD per month</li>
                            <li>Payment required before shop activation</li>
                            <li>Subscription renews automatically each month</li>
                            <li>Cancel anytime with 7 days notice</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Seller Responsibilities
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Provide accurate product descriptions and images</li>
                            <li>Maintain competitive and fair pricing</li>
                            <li>Respond to customer inquiries within 24 hours</li>
                            <li>Honor all product listings and availability</li>
                            <li>Comply with local business regulations</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Content Guidelines
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>No counterfeit or illegal products</li>
                            <li>No misleading or false advertising</li>
                            <li>Professional product images required</li>
                            <li>Appropriate language in all descriptions</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Platform Rules
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Admin reserves right to approve/reject shops</li>
                            <li>Violation of policies may result in shop suspension</li>
                            <li>Platform commission: None (flat monthly fee only)</li>
                            <li>Sellers handle their own shipping and delivery</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Refund Policy
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Monthly fees are non-refundable</li>
                            <li>Unused time is not prorated upon cancellation</li>
                            <li>Refunds only in case of platform technical issues</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopPolicies;
