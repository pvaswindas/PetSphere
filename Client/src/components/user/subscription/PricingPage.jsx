import React, { useEffect } from 'react'
import PricingHeader from './PricingHeader'
import PricingCard from './PricingCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlans, createCheckoutSession } from '../../../redux/slices/SubscriptionSlice'

const PricingPage = () => {
    const dispatch = useDispatch();
    const plans = useSelector((state) => state.subscriptions.plans);
    const checkoutSessionUrl = useSelector((state) => state.subscriptions.checkoutSessionId);

    useEffect(() => {
        dispatch(fetchPlans());
    }, [dispatch]);


    const handleCheckout = async (stripePriceId) => {
        console.log('Sending Plan ID to backend:', stripePriceId);
    
        try {
            const action = await dispatch(createCheckoutSession(stripePriceId));
    
            if (createCheckoutSession.fulfilled.match(action)) {
                const session = action.payload;
                if (session.url) {
                    window.location.href = session.url;
                }
            }
        } catch (error) {
            console.error('Error during checkout session creation:', error);
        }
    }
    

    return (
        <section className="bg-gradient-to-b h-screen from-yellow-50 to-white py-12 px-4 lg:px-20">
            <PricingHeader />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.length > 0 ? (
                    plans.slice().reverse().map((plan) => (
                        <PricingCard key={plan.id} plan={plan} handleCheckout={handleCheckout} />
                    ))
                ) : (
                    <p>No plans available</p>
                )}
            </div>
        </section>
    )
}


export default PricingPage;
