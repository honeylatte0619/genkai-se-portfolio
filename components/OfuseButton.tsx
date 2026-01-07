"use client";

import React from "react";

export const OfuseButton = () => {
    return (
        <a
            href="https://ofuse.me/dace8671"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-[9999] flex items-center justify-center bg-[#F5A623] text-white px-6 py-3 rounded-[50px] font-bold font-sans shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in-out hover:scale-105 no-underline"
            aria-label="OFUSEでラテを奢る"
        >
            <span className="text-[20px] mr-2">☕</span>
            <span>ラテを奢る</span>
        </a>
    );
};
