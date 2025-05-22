import type React from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdMoreVert, MdCancel, MdInfo } from "react-icons/md";
import Link from "next/link";
import { getStatusBadge } from "@/utils/functions-Helper";
import {DesktopTableProps} from '@/types/Token-Table'

const DesktopTable: React.FC<DesktopTableProps> = ({
  tokens,
  activeDropdown,
  hoveredRow,
  toggleDropdown,
  openCreateTSEModal,
  openTerminateModal,
  setHoveredRow,
}) => {
  return (
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
                    <div
                      className={`z-50 absolute right-0 md:right-10 w-56 rounded-lg shadow-xl bg-white ring-1 ring-indigo-200 ring-opacity-5 border border-indigo-100
                      ${index < 5 ? "top-full mt-2 origin-top-right" : "bottom-full mb-2 origin-bottom-right"}
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
                                    {token.productTypes &&
                                      token.productTypes.length > index &&
                                      token.productTypes[index] && (
                                        <p className="text-[12px] text-gray-500 mt-1 ml-8 group-hover:text-gray-700">
                                          Product Type:{" "}
                                          <span className="font-medium">
                                            {token.productTypes[index]}
                                          </span>
                                        </p>
                                      )}
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
                        <button
                          onClick={() => openCreateTSEModal(token)}
                          className="w-full px-4 py-3 text-gray-500 text-center cursor-pointer text-sm flex items-center justify-center hover:bg-indigo-50 transition-colors duration-150"
                        >
                          <MdInfo className="text-gray-400 mr-2 text-lg" />
                          Create TSEs
                        </button>
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
  );
};

export default DesktopTable;