import React from 'react'
import { CheckCircle } from 'lucide-react'

const featureMapping = {
    recharge: ['100 Listings', 'No Subscription Required'],
    monthly: ['Unlimited Listings', 'Priority Support', 'Subscription Plan'],
    yearly: [
        'Unlimited Listings',
        'Priority Support',
        'Advanced Analytics',
        'Save More with Annual Subscription',
    ],
}

const PricingCard = ({ plan, handleCheckout }) => {

    const features = featureMapping[plan.plan_type] || [];
    const isPopular = plan.plan_type === 'monthly';

    return (
        <div
            className={`relative rounded-xl shadow-lg p-8 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                isPopular ? 'border-4 border-yellow-500' : ''
            }`}
        >
            {isPopular && (
                <div className="absolute top-0 left-0 p-2 bg-yellow-500 text-white font-bold text-sm rounded-br-xl z-10">
                    Popular
                </div>
            )}
            <div>
                <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <p className="text-4xl font-bold text-gray-800 mt-6">
                    ${plan.price}
                    {plan?.plan_type === 'monthly' && (
                        <span className="text-lg font-medium text-gray-500">/month</span>
                    )}
                    {plan.plan_type === 'yearly' && (
                        <span className="text-lg font-medium text-gray-500">/year</span>
                    )}
                </p>
                <ul className="space-y-4 mt-6">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                            <CheckCircle className="text-yellow-500 w-5 h-5 mr-2" />
                            <span className="text-gray-600">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => handleCheckout(plan.id)}
                className="w-full py-3 mt-8 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
                Subscribe Now
            </button>
        </div>
    )
}

export default PricingCard
