import React from 'react'
import { XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PaymentCancelPage = () => {
    const navigate = useNavigate()
    return (
        <div
            className="bg-gradient-to-b h-screen flex justify-center items-center 
            from-green-50 to-white py-12 px-4 lg:px-20"
        >
            <div
                className="relative rounded-xl shadow-lg max-w-md w-full p-8 bg-white flex flex-col
                justify-center transition-transform duration-300 ease-in-out transform hover:scale-105 border-4 border-green-500"
            >
                <XCircle className="mx-auto text-green-500 text-6xl mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                Your subscription has been successfully processed. Thank you for subscribing!
                </p>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    onClick={() => navigate(-1)}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

export default PaymentCancelPage
