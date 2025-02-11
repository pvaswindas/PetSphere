import React, { useState, useEffect } from "react";
import plusMembership from "../../../assets/images/ad-preview/plus-membership1.svg";
import { useNavigate } from "react-router-dom";

const premiumFeatures = [
    {
        img: plusMembership,
        heading: "Unlimited Listings",
        description: "Reach more buyers with endless listings",
    },
    {
        img: plusMembership,
        heading: "Personalized News",
        description: "Get tailored updates on pets you love",
    },
    {
        img: plusMembership,
        heading: "Effortless Pet Search",
        description: "Quickly find your perfect pet",
    },
    {
        img: plusMembership,
        heading: "Exclusive Deals",
        description: "Unlock special offers and discounts",
    },
    ];

    const AdPreviewBar = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % premiumFeatures.length);
        }, 5000)
        return () => clearInterval(interval)
    }, []);

    const currentFeature = premiumFeatures[currentIndex]
    const navigate = useNavigate()

    return (
        <aside
            className="w-full h-[168px] bg-ad-preview-gradient shadow-md rounded-lg p-6 mb-4 cursor-pointer"
            onClick={() => navigate('/subscriptions') }
        >
            {/* Ad View Bar content */}
            <div className="flex flex-col items-center justify-center w-full">
                <img src={currentFeature.img} alt={currentFeature.heading} />
                <p className="text-palePink text-xs font-medium mt-5">{currentFeature.heading}</p>
                <p className="text-palePink text-xs font-medium">{currentFeature.description}</p>
            </div>

            {/* Navigation Dots */}
            <div className="mt-3 flex space-x-2 justify-center items-center">
                {premiumFeatures.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1 h-1 rounded-full ${
                    index === currentIndex ? "bg-palePink" : "bg-whiteOpacity05"
                    }`}
                />
                ))}
            </div>
        </aside>
    );
};

export default AdPreviewBar;
