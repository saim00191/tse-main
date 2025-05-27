import type React from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdMoreVert, MdCancel, MdInfo, MdNumbers, MdVerified } from "react-icons/md";
import Link from "next/link";
import { getStatusBadge } from "@/utils/functions-Helper";
import {MobileTableProps} from '@/types/Token-Table'

const MobileTable: React.FC<MobileTableProps> = ({
  tokens,
  activeDropdown,
  showAll,
  toggleDropdown,
  openCreateTSEModal,
  openTerminateModal,
  setShowAll,
}) => {
  return (
    <div className="md:hidden space-y-4">
      {(showAll ? tokens : tokens.slice(0, 5)).map((token, index) => (
        <div
          key={token.creditClientId || index}
          className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex gap-2 justify-between items-center">
            <span className="text-white font-bold text-[12px] whitespace-nowrap">
              Client ID
            </span>
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
                  <span className="text-gray-900 italic">N/A</span>
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
                {token.state && token.state.toLowerCase() === "active" && (
                  <button
                    onClick={() => openTerminateModal(token)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                    aria-label="Delete"
                  >
                    <IoTrashBin className="text-lg" />
                  </button>
                )}
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
                                        ? token.productTypes[index]
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
                      <button
                        onClick={() => openCreateTSEModal(token)}
                        className="w-full px-4 py-3 text-gray-500 text-center text-xs flex items-center justify-center hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <MdInfo className="text-gray-400 mr-2 text-lg" />
                        Create TSEs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {tokens.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline transition-colors duration-200"
          >
            {showAll
              ? "Show less"
              : `Show more (${tokens.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileTable;