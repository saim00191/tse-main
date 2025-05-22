"use client";
import { useState } from "react";
import { Poppins } from "next/font/google";
import {
  MdCancel,
  MdMoreVert,
  MdInfo,
  MdNumbers,
  MdVerified,
} from "react-icons/md";
import Link from "next/link";
import type { Token } from "@/types/types";
import { getStatusBadge } from "@/utils/functions-Helper";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const TokenTable = ({ tokens = [] }: { tokens: Token[] }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false); // New state to control "Show more"

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className={`${poppins.className} w-full`}>
      {/* Desktop view (md and above) */}
      <div className="hidden md:block w-full">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-indigo-100 overflow-hidden transition-all duration-300">
          <table className="w-full divide-y divide-indigo-200">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <tr>
                {["Client ID", "Metadata", "TSEs", "Status", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        {header === "Status" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></div>
                        )}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {tokens.map((token, index) => (
                <tr
                  key={token.creditClientId || index}
                  className={`transition-colors duration-200 ${
                    hoveredRow === index ? "bg-indigo-50" : "hover:bg-purple-50"
                  }`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          <span className="bg-indigo-100 text-indigo-700 py-1 px-2 rounded-md">
                            {token.creditClientId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {token.metadata?.toUpperCase() || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center justify-center min-w-[28px] h-7 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full px-2">
                      {token.tseCount ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(token.state)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        activeDropdown === index
                          ? "bg-indigo-100 text-indigo-600"
                          : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                      }`}
                      aria-label="Actions"
                    >
                      <MdMoreVert className="text-lg" />
                    </button>
                    {activeDropdown === index && (
                      <div
                        className={`z-50 absolute right-0 md:right-10 w-56 rounded-lg shadow-xl bg-white ring-1 ring-indigo-200 ring-opacity-5 border border-indigo-100
                        ${
                          index < 5
                            ? "top-full mt-2 origin-top-right"
                            : "bottom-full mb-2 origin-bottom-right"
                        }
                        animate-fadeIn
                      `}
                      >
                        <div className="py-2 divide-y divide-indigo-100">
                          {token.tseSerialNumbers &&
                          token.tseSerialNumbers.length > 0 ? (
                            token.tseSerialNumbers.map(
                              (serialNumber, idx) =>
                                Number.parseInt(serialNumber, 10) !== 0 && (
                                  <Link
                                    key={serialNumber}
                                    href={`/tses-dashboard/${serialNumber}`}
                                  >
                                    <button className="cursor-pointer block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150 group">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 group-hover:bg-indigo-200">
                                          <span className="text-xs font-bold">
                                            {idx + 1}
                                          </span>
                                        </div>
                                        <span className="font-medium group-hover:text-indigo-600">{`TSE 0${
                                          idx + 1
                                        }`}</span>
                                      </div>
                                      <p className="text-[12px] text-gray-500 mt-1 ml-8 group-hover:text-gray-700">
                                        Product Type:{" "}
                                        <span className="font-medium">
                                          {token.productTypes &&
                                          token.productTypes.length > idx
                                            ? token.productTypes[idx]
                                            : "No product type available"}
                                        </span>
                                      </p>
                                    </button>
                                  </Link>
                                )
                            )
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center text-sm flex items-center justify-center">
                              <MdCancel className="text-gray-400 mr-2 text-lg" />
                              No TSEs to show
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view (sm and below) */}
      <div className="md:hidden space-y-4">
        {(showAll ? tokens : tokens.slice(0, 5)).map((token, index) => (
          <div
            key={token.creditClientId || index}
            className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex gap-2 justify-between items-center">
              <span className="text-white font-bold text-[12px] whitespace-nowrap">Client ID</span>
              <span className="bg-white text-indigo-700 py-1 px-2 rounded-md text-xs font-medium">
                {token.creditClientId}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600 text-xs">
                  <MdInfo className="mr-1" />
                  <span>Metadata</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {token.metadata?.toUpperCase() || (
                    <span className="text-gray-900 italic ">N/A</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600 text-xs">
                  <MdNumbers className="mr-1" />
                  <span>TSEs</span>
                </div>
                <div className="inline-flex items-center justify-center min-w-[28px] h-6 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full px-2">
                  {token.tseCount ?? 0}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600 text-xs">
                  <MdVerified className="mr-1" />
                  <span>Status</span>
                </div>
                <div>{getStatusBadge(token.state)}</div>
              </div>

              <div className="pt-2 border-t border-indigo-100 flex justify-end">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      activeDropdown === index
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                    aria-label="Actions"
                  >
                    <MdMoreVert className="text-lg" />
                  </button>
                  {activeDropdown === index && (
                    <div className="z-50 absolute right-0 w-56 bottom-full mb-2 origin-bottom-right rounded-lg shadow-xl bg-white ring-1 ring-indigo-200 ring-opacity-5 border border-indigo-100 animate-fadeIn">
                      <div className="py-2 divide-y divide-indigo-100">
                        {token.tseSerialNumbers &&
                        token.tseSerialNumbers.length > 0 ? (
                          token.tseSerialNumbers.map(
                            (serialNumber, idx) =>
                              Number.parseInt(serialNumber, 10) !== 0 && (
                                <Link
                                  key={serialNumber}
                                  href={`/tses-dashboard/${serialNumber}`}
                                >
                                  <button className="cursor-pointer block w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-indigo-50 transition-colors duration-150 group">
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 group-hover:bg-indigo-200">
                                        <span className="text-xs font-bold">
                                          {idx + 1}
                                        </span>
                                      </div>
                                      <span className="font-medium group-hover:text-indigo-600">{`TSE 0${
                                        idx + 1
                                      }`}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1 ml-8 group-hover:text-gray-700">
                                      Product Type:{" "}
                                      <span className="font-medium">
                                        {token.productTypes &&
                                        token.productTypes.length > idx
                                          ? token.productTypes[idx]
                                          : "No product type available"}
                                      </span>
                                    </p>
                                  </button>
                                </Link>
                              )
                          )
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center text-xs flex items-center justify-center">
                            <MdCancel className="text-gray-400 mr-2 text-lg" />
                            No TSEs to show
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show more button */}
        {tokens.length > 5 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline transition-colors duration-200"
            >
              {showAll ? "Show less" : `Show more (${tokens.length - 5} more)`}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TokenTable;
