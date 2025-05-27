"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { Poppins } from "next/font/google";
import type { Token } from "@/types/types";
import { client } from "@/sanity/lib/client";
import axios from "axios";
import FilterButtons from "./Filter-Buttons";
import DesktopTable from "./Desktop-Table";
import MobileTable from "./Mobile-Table";
import CreateModal from "./Create-Modal";
import TerminateModal from "./Terminate-Modal";
import GlobalStyles from "./Global-Style";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const TokenTableMain = ({ tokens = [] }: { tokens: Token[] }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filterState, setFilterState] = useState<"active" | "terminated">("active");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalStep, setCreateModalStep] = useState<"details" | "confirmation" | "success">("details");
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [terminateModalStep, setTerminateModalStep] = useState<"confirmation" | "success" | "error">("confirmation");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [creditClientSecret, setCreditClientSecret] = useState("");
  const [confirmationInput, setConfirmationInput] = useState("");
  const [terminateConfirmationInput, setTerminateConfirmationInput] = useState("");
  const [fetchedData, setFetchedData] = useState<{
    creditClientId: string;
    creditClientSecret: string;
    metadata: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creationResult, setCreationResult] = useState<string | null>(null);
  const [terminationResult, setTerminationResult] = useState<string | null>(null);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const openCreateTSEModal = (token: Token) => {
    setSelectedToken(token);
    setIsCreateModalOpen(true);
    setCreateModalStep("details");
    setCreditClientSecret("");
    setConfirmationInput("");
    setCreationResult(null);
    setActiveDropdown(null);
    setError(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedToken || !isCreateModalOpen) return;
      setIsLoading(true);
      try {
        const query = `*[_type == "tse" && creditClientId == $creditClientId][0]{
          creditClientId,
          creditClientSecret,
          metadata
        }`;
        const params = { creditClientId: selectedToken.creditClientId };
        const data = await client.fetch(query, params);

        if (data) {
          setFetchedData(data);
          setCreditClientSecret(data.creditClientSecret || "");
        } else {
          setError("No data found for this Credit Client ID");
        }
      } catch (err) {
        setError("Failed to fetch data from Sanity");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedToken, isCreateModalOpen]);

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalStep("details");
    setSelectedToken(null);
    setCreditClientSecret("");
    setConfirmationInput("");
    setFetchedData(null);
    setError(null);
    setCreationResult(null);
    setIsCreating(false);
  };

  const openTerminateModal = (token: Token) => {
    setSelectedToken(token);
    setIsTerminateModalOpen(true);
    setTerminateModalStep("confirmation");
    setTerminateConfirmationInput("");
    setTerminationResult(null);
    setError(null);
    setIsTerminating(false);
    setActiveDropdown(null);
  };

  const closeTerminateModal = () => {
    setIsTerminateModalOpen(false);
    setTerminateModalStep("confirmation");
    setSelectedToken(null);
    setTerminateConfirmationInput("");
    setTerminationResult(null);
    setError(null);
    setIsTerminating(false);
  };

  const handleCreateNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateModalStep("confirmation");
  };

  const handleCreateBackToDetails = () => {
    setCreateModalStep("details");
    setConfirmationInput("");
    setError(null);
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null) {
      const maybeError = error as Record<string, unknown>;
      const response = maybeError.response as Record<string, unknown> | undefined;
      const data = response?.data as Record<string, unknown> | undefined;
      if (typeof data?.error === "string") return data.error;
      if (typeof data?.message === "string") return data.message;
      if (typeof maybeError.message === "string") return maybeError.message;
      if (typeof maybeError.error === "string") return maybeError.error;
      return "An unknown error occurred";
    }
    return "An unknown error occurred";
  };

  const handleCreateTSE = async () => {
    if (confirmationInput.toLowerCase() !== "create tse") {
      setError('Confirmation text must be exactly "create tse"');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const tseData = {
        metadata: fetchedData?.metadata || "",
        productType: "850007",
        clientId: fetchedData?.creditClientId || "",
        clientSecret: fetchedData?.creditClientSecret || creditClientSecret,
      };

      if (!tseData.clientId || !tseData.clientSecret || !tseData.productType) {
        throw new Error("Missing required fields");
      }

      const res = await fetch("/api/create-tse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tseData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      setCreationResult(data.creationId || "TSE-" + Date.now());
      setCreateModalStep("success");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(`❌ Error: ${errorMessage}`);
      console.error("TSE Creation Error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTerminateCreditToken = async () => {
    if (terminateConfirmationInput.toLowerCase() !== "yes terminate") {
      setError('Confirmation text must be exactly "yes terminate"');
      return;
    }

    setIsTerminating(true);
    setError(null);

    try {
      if (!selectedToken?.creditClientId) {
        throw new Error("No Credit Client ID provided");
      }

      const res = await axios.post("/api/terminate", {
        creditClientId: selectedToken.creditClientId,
      });

      const data = res.data;

      setTerminationResult(data.terminationId || "TERM-" + Date.now());
      setTerminateModalStep("success");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(`❌ Error: ${errorMessage}`);
      setTerminateModalStep("error");
      console.error("Termination Error:", err);
    } finally {
      setIsTerminating(false);
    }
  };

  const isCreateConfirmationValid = confirmationInput.toLowerCase() === "create tse";
  const isTerminateConfirmationValid = terminateConfirmationInput.toLowerCase() === "yes terminate";

  const filteredTokens = tokens.filter(
    (token) => token.state && token.state.toLowerCase() === filterState
  );

  const getCreateTransform = () => {
    switch (createModalStep) {
      case "details":
        return "translateX(0%)";
      case "confirmation":
        return "translateX(-33.33%)";
      case "success":
        return "translateX(-66.66%)";
      default:
        return "translateX(0%)";
    }
  };

  const getTerminateTransform = () => {
    switch (terminateModalStep) {
      case "confirmation":
        return "translateX(0%)";
      case "success":
      case "error":
        return "translateX(-50%)";
      default:
        return "translateX(0%)";
    }
  };

  return (
    <div className={`${poppins.className} w-full`}>
      <FilterButtons filterState={filterState} setFilterState={setFilterState} />
      <DesktopTable
        tokens={filteredTokens}
        activeDropdown={activeDropdown}
        hoveredRow={hoveredRow}
        toggleDropdown={toggleDropdown}
        openCreateTSEModal={openCreateTSEModal}
        openTerminateModal={openTerminateModal}
        setHoveredRow={setHoveredRow}
      />
      <MobileTable
        tokens={filteredTokens}
        activeDropdown={activeDropdown}
        showAll={showAll}
        toggleDropdown={toggleDropdown}
        openCreateTSEModal={openCreateTSEModal}
        openTerminateModal={openTerminateModal}
        setShowAll={setShowAll}
      />
      <CreateModal
        isOpen={isCreateModalOpen}
        createModalStep={createModalStep}
        selectedToken={selectedToken}
        creditClientSecret={creditClientSecret}
        confirmationInput={confirmationInput}
        fetchedData={fetchedData}
        isLoading={isLoading}
        isCreating={isCreating}
        error={error}
        creationResult={creationResult}
        isCreateConfirmationValid={isCreateConfirmationValid}
        getCreateTransform={getCreateTransform}
        closeCreateModal={closeCreateModal}
        handleCreateNextStep={handleCreateNextStep}
        handleCreateBackToDetails={handleCreateBackToDetails}
        handleCreateTSE={handleCreateTSE}
        setCreditClientSecret={setCreditClientSecret}
        setConfirmationInput={setConfirmationInput}
      />
      <TerminateModal
        isOpen={isTerminateModalOpen}
        terminateModalStep={terminateModalStep}
        selectedToken={selectedToken}
        terminateConfirmationInput={terminateConfirmationInput}
        isTerminating={isTerminating}
        error={error}
        terminationResult={terminationResult}
        isTerminateConfirmationValid={isTerminateConfirmationValid}
        getTerminateTransform={getTerminateTransform}
        closeTerminateModal={closeTerminateModal}
        handleTerminateCreditToken={handleTerminateCreditToken}
        setTerminateConfirmationInput={setTerminateConfirmationInput}
      />
      <GlobalStyles />
    </div>
  );
};

export default TokenTableMain;

























// "use client";
// import { useState } from "react";
// import type React from "react";
// import { Poppins } from "next/font/google";
// import type { Token } from "@/types/types";
// import { client } from "@/sanity/lib/client";
// import axios from "axios";
// import FilterButtons from "./Filter-Buttons";
// import DesktopTable from "./Desktop-Table";
// import MobileTable from "./Mobile-Table";
// import CreateModal from "./Create-Modal";
// import TerminateModal from "./Terminate-Modal";
// import GlobalStyles from "./Global-Style";

// const poppins = Poppins({
//   weight: ["400", "600", "700"],
//   subsets: ["latin"],
// });

// const TokenTableMain = ({ tokens = [] }: { tokens: Token[] }) => {
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const [hoveredRow, setHoveredRow] = useState<number | null>(null);
//   const [showAll, setShowAll] = useState(false);
//   const [filterState, setFilterState] = useState<"active" | "terminated">(
//     "active"
//   );
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [createModalStep, setCreateModalStep] = useState<
//     "details" | "confirmation" | "success"
//   >("details");
//   const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
//   const [terminateModalStep, setTerminateModalStep] = useState<
//     "confirmation" | "success" | "error"
//   >("confirmation");
//   const [selectedToken, setSelectedToken] = useState<Token | null>(null);
//   const [creditClientSecret, setCreditClientSecret] = useState("");
//   const [confirmationInput, setConfirmationInput] = useState("");
//   const [terminateConfirmationInput, setTerminateConfirmationInput] =
//     useState("");
//   const [fetchedData, setFetchedData] = useState<{
//     creditClientId: string;
//     creditClientSecret: string;
//     metadata: string;
//   } | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isTerminating, setIsTerminating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [creationResult, setCreationResult] = useState<string | null>(null);
//   const [terminationResult, setTerminationResult] = useState<string | null>(
//     null
//   );

//   const toggleDropdown = (index: number) => {
//     setActiveDropdown(activeDropdown === index ? null : index);
//   };

//   const openCreateTSEModal = async (token: Token) => {
//     setSelectedToken(token);
//     setIsCreateModalOpen(true);
//     setCreateModalStep("details");
//     setCreditClientSecret("");
//     setConfirmationInput("");
//     setCreationResult(null);
//     setActiveDropdown(null);
//     setIsLoading(true);
//     setError(null);

//     try {
//       const query = `*[_type == "tse" && creditClientId == $creditClientId][0]{
//         creditClientId,
//         creditClientSecret,
//         metadata
//       }`;
//       const params = { creditClientId: token.creditClientId };
//       const data = await client.fetch(query, params);

//       if (data) {
//         setFetchedData(data);
//         setCreditClientSecret(data.creditClientSecret || "");
//       } else {
//         setError("No data found for this Credit Client ID");
//       }
//     } catch (err) {
//       setError("Failed to fetch data from Sanity");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const closeCreateModal = () => {
//     setIsCreateModalOpen(false);
//     setCreateModalStep("details");
//     setSelectedToken(null);
//     setCreditClientSecret("");
//     setConfirmationInput("");
//     setFetchedData(null);
//     setError(null);
//     setCreationResult(null);
//     setIsCreating(false);
//   };

//   const openTerminateModal = (token: Token) => {
//     setSelectedToken(token);
//     setIsTerminateModalOpen(true);
//     setTerminateModalStep("confirmation");
//     setTerminateConfirmationInput("");
//     setTerminationResult(null);
//     setError(null);
//     setIsTerminating(false);
//     setActiveDropdown(null);
//   };

//   const closeTerminateModal = () => {
//     setIsTerminateModalOpen(false);
//     setTerminateModalStep("confirmation");
//     setSelectedToken(null);
//     setTerminateConfirmationInput("");
//     setTerminationResult(null);
//     setError(null);
//     setIsTerminating(false);
//   };

//   const handleCreateNextStep = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCreateModalStep("confirmation");
//   };

//   const handleCreateBackToDetails = () => {
//     setCreateModalStep("details");
//     setConfirmationInput("");
//     setError(null);
//   };

//   const getErrorMessage = (error: unknown): string => {
//     if (error instanceof Error) {
//       return error.message;
//     }

//     if (typeof error === "string") {
//       return error;
//     }

//     if (typeof error === "object" && error !== null) {
//       const maybeError = error as Record<string, unknown>;

//       const response = maybeError.response as
//         | Record<string, unknown>
//         | undefined;
//       const data = response?.data as Record<string, unknown> | undefined;

//       if (typeof data?.error === "string") return data.error;
//       if (typeof data?.message === "string") return data.message;
//       if (typeof maybeError.message === "string") return maybeError.message;
//       if (typeof maybeError.error === "string") return maybeError.error;
//       if (typeof maybeError.details === "string") return maybeError.details;
//       if (typeof maybeError.description === "string")
//         return maybeError.description;

//       try {
//         return JSON.stringify(error);
//       } catch {
//         return "An unknown error occurred";
//       }
//     }

//     return "An unknown error occurred";
//   };

//   const handleCreateTSE = async () => {
//     if (confirmationInput.toLowerCase() !== "create tse") {
//       setError('Confirmation text must be exactly "create tse"');
//       return;
//     }

//     setIsCreating(true);
//     setError(null);

//     try {
//       const tseData = {
//         metadata: fetchedData?.metadata || "",
//         productType: "850007",
//         clientId: fetchedData?.creditClientId || "",
//         clientSecret: fetchedData?.creditClientSecret || creditClientSecret,
//       };

//       if (!tseData.clientId || !tseData.clientSecret || !tseData.productType) {
//         throw new Error(
//           "Invalid data: clientId, clientSecret, and productType are required"
//         );
//       }
//       if (tseData.productType === "default") {
//         throw new Error(
//           "Invalid productType: a valid product type is required"
//         );
//       }

//       console.log("Creating TSE with data:", tseData);

//       const res = await fetch("/api/create-tse", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(tseData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         let errorMessage =
//           data?.error ||
//           data?.message ||
//           `HTTP ${res.status}: ${res.statusText}`;
//         if (errorMessage.includes("Invalid credentials")) {
//           errorMessage =
//             "Authentication failed: Please check your client ID and secret.";
//         } else if (errorMessage.includes("Invalid productType")) {
//           errorMessage =
//             "Invalid product type: Please select a valid product type.";
//         }
//         throw new Error(errorMessage);
//       }

//       setCreationResult(data.creationId || "TSE-" + Date.now());
//       setCreateModalStep("success");
//     } catch (err) {
//       const errorMessage = getErrorMessage(err);
//       setError(`❌ Error: ${errorMessage}`);
//       console.error("TSE Creation Error:", err);
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleTerminateCreditToken = async () => {
//     if (terminateConfirmationInput.toLowerCase() !== "yes terminate") {
//       setError('Confirmation text must be exactly "yes terminate"');
//       return;
//     }

//     setIsTerminating(true);
//     setError(null);

//     try {
//       if (!selectedToken?.creditClientId) {
//         throw new Error("No Credit Client ID provided");
//       }

//       const res = await axios.post("/api/terminate", {
//         creditClientId: selectedToken.creditClientId,
//       });

//       const data = res.data;

//       setTerminationResult(data.terminationId || "TERM-" + Date.now());
//       setTerminateModalStep("success");
//     } catch (err) {
//       const errorMessage = getErrorMessage(err);
//       setError(`❌ Error: ${errorMessage}`);
//       setTerminateModalStep("error");
//       console.error("Termination Error:", err);
//     } finally {
//       setIsTerminating(false);
//     }
//   };

//   const isCreateConfirmationValid =
//     confirmationInput.toLowerCase() === "create tse";
//   const isTerminateConfirmationValid =
//     terminateConfirmationInput.toLowerCase() === "yes terminate";

//   const filteredTokens = tokens.filter(
//     (token) => token.state && token.state.toLowerCase() === filterState
//   );

//   const getCreateTransform = () => {
//     switch (createModalStep) {
//       case "details":
//         return "translateX(0%)";
//       case "confirmation":
//         return "translateX(-33.33%)";
//       case "success":
//         return "translateX(-66.66%)";
//       default:
//         return "translateX(0%)";
//     }
//   };

//   const getTerminateTransform = () => {
//     switch (terminateModalStep) {
//       case "confirmation":
//         return "translateX(0%)";
//       case "success":
//         return "translateX(-50%)";
//       case "error":
//         return "translateX(-50%)";
//       default:
//         return "translateX(0%)";
//     }
//   };

//   return (
//     <div className={`${poppins.className} w-full`}>
//       <FilterButtons
//         filterState={filterState}
//         setFilterState={setFilterState}
//       />
//       <DesktopTable
//         tokens={filteredTokens}
//         activeDropdown={activeDropdown}
//         hoveredRow={hoveredRow}
//         toggleDropdown={toggleDropdown}
//         openCreateTSEModal={openCreateTSEModal}
//         openTerminateModal={openTerminateModal}
//         setHoveredRow={setHoveredRow}
//       />
//       <MobileTable
//         tokens={filteredTokens}
//         activeDropdown={activeDropdown}
//         showAll={showAll}
//         toggleDropdown={toggleDropdown}
//         openCreateTSEModal={openCreateTSEModal}
//         openTerminateModal={openTerminateModal}
//         setShowAll={setShowAll}
//       />
//       <CreateModal
//         isOpen={isCreateModalOpen}
//         createModalStep={createModalStep}
//         selectedToken={selectedToken}
//         creditClientSecret={creditClientSecret}
//         confirmationInput={confirmationInput}
//         fetchedData={fetchedData}
//         isLoading={isLoading}
//         isCreating={isCreating}
//         error={error}
//         creationResult={creationResult}
//         isCreateConfirmationValid={isCreateConfirmationValid}
//         getCreateTransform={getCreateTransform}
//         closeCreateModal={closeCreateModal}
//         handleCreateNextStep={handleCreateNextStep}
//         handleCreateBackToDetails={handleCreateBackToDetails}
//         handleCreateTSE={handleCreateTSE}
//         setCreditClientSecret={setCreditClientSecret}
//         setConfirmationInput={setConfirmationInput}
//       />
//       <TerminateModal
//         isOpen={isTerminateModalOpen}
//         terminateModalStep={terminateModalStep}
//         selectedToken={selectedToken}
//         terminateConfirmationInput={terminateConfirmationInput}
//         isTerminating={isTerminating}
//         error={error}
//         terminationResult={terminationResult}
//         isTerminateConfirmationValid={isTerminateConfirmationValid}
//         getTerminateTransform={getTerminateTransform}
//         closeTerminateModal={closeTerminateModal}
//         handleTerminateCreditToken={handleTerminateCreditToken}
//         setTerminateConfirmationInput={setTerminateConfirmationInput}
//       />
//       <GlobalStyles />
//     </div>
//   );
// };

// export default TokenTableMain;
