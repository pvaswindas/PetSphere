import React from "react";
import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import animation1 from "../assets/lottie/Animation - 1740412075187.json";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-white flex flex-col lg:flex-row lg:gap-16 items-center justify-center h-screen">
            <Lottie animationData={animation1} className="w-96" loop />
            <div className="flex flex-col items-center lg:items-start justify-center gap-3">
                <h1 className="text-5xl font-bold text-black/80">Oops!</h1>
                <p className="flex flex-col items-center lg:items-start justify-center font-medium text-black/20">
                    <span className="block">We couldn't find the page</span>
                    <span className="block">you were looking for</span>
                </p>
                <button
                    className="flex flex-grow items-center justify-center gap-1 w-28 px-4 py-2 mt-2 text-sm bg-black/80
                    text-white rounded-full"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={15} />
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
