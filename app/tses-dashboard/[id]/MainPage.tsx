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
import {DashboardData , MetricCardProps} from "@/types/types";

export default function Home({ data }: { data: DashboardData }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <main className="flex-1 p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-indigo-700">
              Certification Dashboard
            </h1>
            <p className="text-indigo-600 mt-2 text-sm">
              TSE ID: <span className="text-[14px] font-medium">{data.serialNumber}</span>
            </p>
            <p className="text-indigo-600 mt-2 text-sm">
              Certification ID: <span className="font-medium">{data.certificationId}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Storage Usage"
              value={`${data.storageUsed} `}
              total={`${data.storageCapacity} `}
              icon={<FiDatabase className="h-6 w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Registered Clients"
              value={data.numRegisteredClients}
              icon={<FiUsers className="h-6 w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Signatures This Month"
              value={data.productTypeUsage?.signaturesCurrentMonth ?? 0}
              total={`${data.productTypeUsage?.signatureLimit}`}
              icon={<FiFileText className="h-6 w-6" />}
              color="from-indigo-600 to-purple-600"
            />

            <StatCard
              title="Signature Duration"
              value={`${data.productTypeUsage?.signatureDuration}`}
              icon={<FiClock className="h-6 w-6" />}
              color="from-indigo-600 to-purple-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
              <div className="flex items-center mb-4">
                <FiPieChart className="h-5 w-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-indigo-700">
                  Signature Metrics Overview
                </h2>
              </div>
              <div className="h-80">
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
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#6366F1" /> {/* indigo-500 */}
                      <Cell fill="#818CF8" /> {/* indigo-400 */}
                      <Cell fill="#A5B4FC" /> {/* indigo-300 */}
                      <Cell fill="#C7D2FE" /> {/* indigo-200 */}
                      <Cell fill="#E0E7FF" /> {/* indigo-100 */}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}`, name]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#E0E7FF",
                        color: "#312E81",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: "20px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Below Chart */}
              <div className="text-sm text-indigo-700 space-y-1 mt-4">
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                  <strong>Created Signatures:</strong> {data.createdSignatures}
                </p>
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-400 mr-2"></span>
                  <strong>Signature Limit:</strong>{" "}
                  {data.productTypeUsage?.signatureLimit}
                </p>
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-300 mr-2"></span>
                  <strong>Signatures This Month:</strong>{" "}
                  {data.productTypeUsage?.signaturesCurrentMonth}
                </p>
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-200 mr-2"></span>
                  <strong>Slowdown Active:</strong>{" "}
                  {data.productTypeUsage?.slowdownActiveSignatureDuration}{" "}
                </p>
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-100 mr-2"></span>
                  <strong>Slowdown Inactive:</strong>{" "}
                  {data.productTypeUsage?.slowdownInactiveSignatureDuration}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 mb-8">
            <div className="flex items-center mb-4">
              <FiBarChart2 className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-indigo-700">
                Storage Overview
              </h2>
            </div>
            <div className="h-80">
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
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
  color,
}: StatCardProps) {
  return (
    <div className={`h-32 w-full bg-gradient-to-r ${color} text-white px-4 py-3 rounded-xl shadow-lg border flex flex-col gap-3 border-indigo-200 transition-transform duration-200 hover:scale-[1.02]`}>
      <h2 className="text-sm font-semibold tracking-wide uppercase text-white opacity-90">
        {title}
      </h2>
      <h4 className="text-2xl font-bold">{value}</h4>
      {total && (
        <p className="text-sm text-indigo-100">{total}</p>
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


function MetricCard({ title, value, icon, color, bgColor = "bg-indigo-100" }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center mb-2">
        <div className={`${bgColor} p-2 rounded-lg mr-3 ${color}`}>{icon}</div>
        <h3 className="text-lg font-medium text-indigo-700">
          {title}
        </h3>
      </div>
      <p className="text-3xl font-bold text-indigo-700">
        {value.toLocaleString()}
      </p>
    </div>
  );
}