"use client";

import { useEffect, useState } from "react";

interface StorageSpeedometerProps {
  usedStorage: number;
  totalStorage: number;
  unit?: string;
}

export default function StorageSpeedometer({
  usedStorage,
  totalStorage,
  unit = "GB",
}: StorageSpeedometerProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = Math.min(
      100,
      (usedStorage / totalStorage) * 100
    );
    let start = 0;
    const animationDuration = 1000;
    const steps = 60;
    const increment = calculatedPercentage / steps;
    const stepTime = animationDuration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= calculatedPercentage) {
        setPercentage(calculatedPercentage);
        clearInterval(timer);
      } else {
        setPercentage(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [usedStorage, totalStorage]);

  const needleRotation = -90 + percentage * 1.8;

  const getGradientId = () => {
    if (percentage < 50) return "lowUsageGradient";
    if (percentage < 80) return "mediumUsageGradient";
    return "highUsageGradient";
  };

  const formatStorage = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="">
      <div className="relative w-full bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-indigo-100 flex flex-col items-center pt-2 pb-3">
        {/* Title with reduced margin */}
        <div className="w-full text-center mb-1">
          <span className="text-[27px] font-bold text-indigo-700">
            Storage Usage
          </span>
        </div>

        {/* Speedometer with reduced margin */}
        <div className="relative w-full h-full flex items-center justify-center -mt-2 -mb-2">
          <svg viewBox="0 0 200 120" className="w-full max-w-full">
            <defs>
              <linearGradient
                id="lowUsageGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient
                id="mediumUsageGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient
                id="highUsageGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>

            <path
              d="M20,100 A80,80 0 0,1 180,100"
              fill="none"
              stroke="#c7d2fe"
              strokeWidth="10"
              strokeLinecap="round"
            />

            <path
              d="M20,100 A80,80 0 0,1 180,100"
              fill="none"
              stroke={`url(#${getGradientId()})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.8} 280`}
            />

            {[0, 25, 50, 75, 100].map((tick) => {
              const angle = -180 + (tick * 180) / 100;
              const x1 = 100 + 70 * Math.cos((angle * Math.PI) / 180);
              const y1 = 100 + 70 * Math.sin((angle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((angle * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin((angle * Math.PI) / 180);

              const labelX = 100 + 60 * Math.cos((angle * Math.PI) / 180);
              const labelY = 100 + 60 * Math.sin((angle * Math.PI) / 180);

              return (
                <g key={tick}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#a78bfa"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="#5b21b6"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            <g transform={`rotate(${needleRotation}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="#4c1d95"
                strokeWidth="2"
              />
              <circle
                cx="100"
                cy="100"
                r="8"
                fill="#ffffff"
                stroke="#4c1d95"
                strokeWidth="2"
              />
            </g>

            <text
              x="100"
              y="85"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#4c1d95"
            >
              {percentage.toFixed(1)}%
            </text>
          </svg>
        </div>

        {/* Storage info with reduced margin */}
        <div className="w-full flex justify-between px-8 mt-1">
          <div className="text-center">
            <p className="text-xs text-indigo-600">Used</p>
            <p className="font-semibold text-indigo-800">
              {formatStorage(usedStorage)} {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-indigo-600">Total</p>
            <p className="font-semibold text-indigo-800">
              {formatStorage(totalStorage)} {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}