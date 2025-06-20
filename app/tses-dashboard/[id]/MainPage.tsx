"use client";

import type React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiDatabase,
  FiUsers,
  FiFileText,
  FiClock,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";
import { DashboardData, MetricCardProps } from "@/types/types";
import Link from "next/link";

export default function Home({ data }: { data: DashboardData }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <main className="flex-1 px-4 py-6 sm:px-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link className="flex items-center mb-4 md:mb-6" href="/">
                <p className="text-gray-500 font-medium text-[14px] hover:underline cursor-pointer">Back to Home</p>
            </Link>
            <h1 className="text-2xl md:text-[26px] font-bold text-indigo-700">
              Certification Dashboard
            </h1>
            <div className="text-indigo-600 mt-2 text-sm space-y-1">
              <p className="break-all">
                TSE ID:{" "}
                <span className="text-[14px] font-medium bg-blue-300 rounded-[8px] px-1.5">
                  {data.serialNumber}
                </span>
              </p>
              <p className="break-all">
                Certification ID:{" "}
                <span className="font-medium">{data.certificationId}</span>
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 mb-6 md:mb-8">
            <StatCard
              title="Storage Usage"
              value={`${data.storageUsed}`}
              total={`${data.storageCapacity}`}
              icon={<FiDatabase className="h-5 w-5 md:h-6 md:w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Registered Clients"
              value={data.numRegisteredClients}
              icon={<FiUsers className="h-5 w-5 md:h-6 md:w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Signatures This Month"
              value={data.productTypeUsage?.signaturesCurrentMonth ?? 0}
              total={`${data.productTypeUsage?.signatureLimit}`}
              icon={<FiFileText className="h-5 w-5 md:h-6 md:w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Signature Duration"
              value={`${data.productTypeUsage?.signatureDuration}`}
              icon={<FiClock className="h-5 w-5 md:h-6 md:w-6" />}
              color="from-indigo-600 to-purple-600"
            />
          </div>

          {/* Pie Chart */}
          <div className="grid grid-cols-1 gap-5 mb-6 md:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 md:p-6 w-full">
              <div className="flex items-center mb-3 md:mb-4">
                <FiPieChart className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <h2 className="text-lg md:text-xl font-semibold text-indigo-700 truncate">
                  Signature Metrics Overview
                </h2>
              </div>

              <div className="w-full h-80 sm:h-72 md:h-80 lg:h-96 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Created Signatures",
                          value: data.createdSignatures,
                        },
                        {
                          name: "Signature Limit",
                          value: data.productTypeUsage?.signatureLimit,
                        },
                        {
                          name: "Signatures This Month",
                          value: data.productTypeUsage?.signaturesCurrentMonth,
                        },
                        {
                          name: "Slowdown Active",
                          value:
                            data.productTypeUsage
                              ?.slowdownActiveSignatureDuration,
                        },
                        {
                          name: "Slowdown Inactive",
                          value:
                            data.productTypeUsage
                              ?.slowdownInactiveSignatureDuration,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      labelLine={false}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#6366F1" />
                      <Cell fill="#818CF8" />
                      <Cell fill="#A5B4FC" />
                      <Cell fill="#C7D2FE" />
                      <Cell fill="#E0E7FF" />
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}`, name]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#E0E7FF",
                        color: "#312E81",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: "10px",
                        fontSize: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Summary */}
              <div className="text-xs md:text-sm text-indigo-700 space-y-1 mt-3 md:mt-4">
                <p>
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-500 mr-2"></span>
                  <strong>Created Signatures:</strong> {data.createdSignatures}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400 mr-2"></span>
                  <strong>Signature Limit:</strong>{" "}
                  {data.productTypeUsage?.signatureLimit}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-300 mr-2"></span>
                  <strong>Signatures This Month:</strong>{" "}
                  {data.productTypeUsage?.signaturesCurrentMonth}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-200 mr-2"></span>
                  <strong>Slowdown Active:</strong>{" "}
                  {data.productTypeUsage?.slowdownActiveSignatureDuration}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-100 mr-2"></span>
                  <strong>Slowdown Inactive:</strong>{" "}
                  {data.productTypeUsage?.slowdownInactiveSignatureDuration}
                </p>
              </div>
            </div>
          </div>

          {/* Storage Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 md:p-6 mb-6 md:mb-8 w-full">
            {/* Storage Overview Title */}
            <div className="flex items-center mb-3 md:mb-4">
              <FiBarChart2 className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-indigo-700">
                Storage Overview
              </h2>
            </div>

            {/* For Small Devices: Display total used and available storage */}
            <div className="block sm:hidden">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="text-indigo-700 font-semibold text-lg">
                  Total Storage
                </div>
                <div className="flex justify-between mt-2 flex-col flex-row-400  border-b-2 border-b-gray-200">
                  <div className="text-sm text-indigo-500">Total Storage:</div>
                  <div className="font-semibold text-right">
                    {data.storageCapacity}{" "}
                  </div>
                </div>
                <div className="flex justify-between mt-2 flex-col flex-row-400  border-b-2 border-b-gray-200">
                  <div className="text-sm text-indigo-500">Used Storage:</div>
                  <div className="font-semibold text-right">
                    {data.storageUsed}{" "}
                  </div>
                </div>
                <div className="flex justify-between mt-2 flex-col flex-row-400  border-b-2 border-b-gray-200">
                  <div className="text-sm text-indigo-500">
                    Remaining Storage:
                  </div>
                  <div className="font-semibold text-right">
                    {data.storageCapacity - data.storageUsed}{" "}
                  </div>
                </div>
              </div>
            </div>

            {/* For Larger Devices: Show the Bar Chart */}
            <div className="hidden sm:block w-full h-64 sm:h-72 md:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Storage",
                      capacity: data.storageCapacity,
                      used: data.storageUsed,
                      remaining: data.storageCapacity - data.storageUsed,
                    },
                  ]}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                  <XAxis dataKey="name" stroke="#4F46E5" />
                  <YAxis stroke="#4F46E5" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#E0E7FF",
                      color: "#312E81",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="capacity"
                    name="Storage Capacity"
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="used"
                    name="Used Storage"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="remaining"
                    name="Remaining Storage"
                    fill="#A5B4FC"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-5">
            <MetricCard
              title="Started Transactions"
              value={data.numStartedTransactions}
              icon={<FiBarChart2 className="h-5 w-5" />}
              color="text-indigo-700"
              bgColor="bg-indigo-100"
            />
            <MetricCard
              title="Billing Period Months"
              value={data.productTypeUsage?.billingPeriodMonths ?? 0}
              icon={<FiFileText className="h-5 w-5" />}
              color="text-indigo-700"
              bgColor="bg-indigo-100"
            />
            <MetricCard
              title="Software Version"
              value={data.softwareVersion}
              icon={<FiFileText className="h-5 w-5" />}
              color="text-indigo-700"
              bgColor="bg-indigo-100"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// ----------------------
// StatCard Component
// ----------------------

interface StatCardProps {
  title: string;
  value: string | number;
  total?: string;
  percentage?: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({
  title,
  value,
  total,
  percentage,
  icon,
  color,
}: StatCardProps) {

  return (
    <div
      className={`w-full bg-gradient-to-r ${color} text-white px-3 py-3 md:px-4 md:py-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg border flex flex-col gap-1 md:gap-2 border-indigo-200`}
    >

      <div className="flex items-center justify-between">
        <h2 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-white opacity-90">
          {title}
        </h2>
        
        <div className="opacity-80">{icon}</div>
      </div>
      <h4 className="text-xl md:text-2xl font-bold">{value}</h4>
      {total && (
        <p className="text-xs md:text-sm text-indigo-100">Total: {total}</p>
      )}
      {percentage !== undefined && (
        <div className="mt-1">
          <div className="w-full bg-indigo-400 bg-opacity-30 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-white"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------
// MetricCard Component
// ----------------------

function MetricCard({
  title,
  value,
  icon,
  color,
  bgColor = "bg-indigo-100",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-indigo-100 p-4 md:p-6">
      <div className="flex items-center mb-1 md:mb-2">
        <div
          className={`${bgColor} p-1 md:p-2 rounded-md md:rounded-lg mr-2 md:mr-3 ${color}`}
        >
          {icon}
        </div>
        <h3 className="text-base md:text-lg font-medium text-indigo-700">
          {title}
        </h3>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-indigo-700">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
