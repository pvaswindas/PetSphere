import React from 'react';
import SymbolLogo from "../../assets/logo/symbol-logo.svg"

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
            <img
                src={SymbolLogo}
                alt="Loading..."
                className="w-14 h-14 animate-wobble"
            />
            </div>
        </div>
    );
};

export default LoadingScreen;
