import React from 'react';
import SymbolLogo from '../../../assets/logo/symbol-logo.svg';

export default function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <img src={SymbolLogo} alt="" className="w-9 h-9" />
            <span className="text-2xl font-bold text-teal-600">PetSphere</span>
        </div>
    );
}