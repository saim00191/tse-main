import {
  getCreditTokens,
  getTSEsForToken,
  getTSEsTokenData,
} from "@/utils/lib";
import React from "react";
import StorageSpeedometer from "./StorageDetails";
import {Token  , TSEData , StorageMetrics , Stat} from "@/types/dashboard";


const Dashboard_Overview: React.FC = async () => {
  const tokens: Token[] = await getCreditTokens();
  const activeTSEs = tokens.filter((token) => token.state === "active");
  const terminatedTSEs = tokens.filter((token) => token.state === "terminated");

  const activeTSEss = await Promise.all(
    tokens.map(async (item) => {
      if (!item.creditClientId) return null;
      try {
        const data = await getTSEsForToken(item.creditClientId);
        return data?.length ? data : null;
      } catch (error) {
        console.log(error)
        return null;
      }
    })
  );

  // Extract serial numbers and get detailed token data
  const tseDetails: (TSEData | null)[] = await Promise.all(
    activeTSEss
      .filter(Boolean)
      .flat()
      .map(async ({ tseSerialNumber, creditClientId }) => {
        try {
          const detail = await getTSEsTokenData(tseSerialNumber);
          return { creditClientId, tseSerialNumber, detail };
        } catch (error) {
          console.log(error)
          return null;
        }
      })
  );

  // Filter out failed requests
  const validTseDetails: TSEData[] = tseDetails.filter(Boolean) as TSEData[];

  const storageMetrics: StorageMetrics = validTseDetails.reduce(
    (acc, { detail }) => {
      // Check if storage capacity exists and is a number
      if (typeof detail.storageCapacity === "number") {
        acc.totalCapacity += detail.storageCapacity;
      }

      // Check if storage used exists and is a number
      if (typeof detail.storageUsed === "number") {
        acc.totalUsed += detail.storageUsed;
      }

      // Count devices that have storage data
      if (
        typeof detail.storageCapacity === "number" ||
        typeof detail.storageUsed === "number"
      ) {
        acc.devicesWithStorageData++;
      }

      return acc;
    },
    {
      totalCapacity: 0,
      totalUsed: 0,
      devicesWithStorageData: 0,
      totalDevices: validTseDetails.length,
    }
  );

  

  const stats: Stat[] = [
    {
      title: "Credit Tokens",
      value: tokens.length,
      description: "Total Credit Tokens",
    },
    {
      title: "Active TSEs",
      value: activeTSEs.length,
      description: "Currently Active",
    },
    {
      title: "Terminated TSEs",
      value: terminatedTSEs.length,
      description: "No Longer in use",
    },
    {
      title: "Total Storage",
      value: storageMetrics.totalCapacity,
      description: "Total Storage",
    },
    
  ];

  return (
    <>
      <div className="flex flex-col gap-5 md:p-5 w-full">
        <h1 className="text-[26px] font-bold text-white">TSE DASHBOARD</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {stats.map((item, index) => (
            <div
              key={index}
              className="h-32 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg border flex flex-col gap-3 border-indigo-200 transition-transform duration-200 hover:scale-[1.02]"
            >
              <h2 className="text-sm font-semibold tracking-wide uppercase text-white opacity-90">
                {item.title}
              </h2>
              <h4 className="text-2xl font-bold">{item.value}</h4>
              <p className="text-sm text-indigo-100">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5">
        <StorageSpeedometer
          totalStorage={storageMetrics.totalCapacity}
          usedStorage={storageMetrics.totalUsed}
        />
      </div>
    </>
  );
};

export default Dashboard_Overview;
