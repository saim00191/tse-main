"use client";

import { client } from "@/sanity/lib/client";
import type React from "react";
import { useState } from "react";

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TokenData {
  creditClientId: string;
  creditClientSecret: string;
  metadata: string;
  state: string;
  validProductTypes: string[];
}

const AddTokenModal = ({ isOpen, onClose }: AddTokenModalProps) => {
  const [metadata, setMetadata] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokensArray, setTokensArray] = useState<TokenData[]>([]);
  const [responseMsg, setResponseMsg] = useState("");

  if (!isOpen) return null;

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!metadata) {
    setResponseMsg("Please enter metadata before sending.");
    return;
  }

  setIsLoading(true);
  setResponseMsg("");

  const doc = {
    _type: "tse",
    metadata,
    state: "active",
    validProductTypes: ["850004", "850005", "850007", "850006", "850008"],
  };

  try {
    // Step 1: Save the base document
    const createdDoc = await client.create(doc);
    const docId = createdDoc._id;

    // Step 2: Send to your API
    const response = await fetch("/api/credit-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doc),
    });

    const data = await response.json();

    if (!response.ok) {
      setResponseMsg(`Error ${response.status}: ${JSON.stringify(data)}`);
    } else {
      const newTokens = Array.isArray(data) ? data : [data];

      const parsedTokens = newTokens.map((token) => ({
        ...token,
        validProductTypes: token.validProductTypes || [],
      }));

      // Step 3: Patch the original Sanity doc with creditClientId and creditClientSecret
      await client.patch(docId)
        .set({
          creditClientId: parsedTokens[0].creditClientId,
          creditClientSecret: parsedTokens[0].creditClientSecret,
          metadata: metadata,
        })
        .commit();

      // Step 4: Update UI
      setTokensArray((prev) => [...prev, ...parsedTokens]);
      setMetadata("");
    }
  } catch (error) {
    setResponseMsg(
      "Error: " +
        (error instanceof Error ? error.message : String(error))
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-700">
            Add Credit Token
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="metaData"
            >
              Meta Data
            </label>
            <input
              id="metaData"
              type="text"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Enter metadata"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-700 hover:bg-indigo-800"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              {isLoading ? "Sending..." : "Save"}
            </button>
          </div>
        </form>

        {responseMsg && (
          <pre className="mt-4 bg-red-100 text-red-800 p-3 rounded border text-sm whitespace-pre-wrap">
            {responseMsg}
          </pre>
        )}

        {tokensArray.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              ✅ Stored Tokens:
            </h3>
            {tokensArray.map((token, index) => (
              <div
                key={index}
                className="bg-green-100 border border-green-300 p-4 mb-2 rounded-lg text-sm text-green-900"
              >
                <p>
                  <strong>Client ID:</strong> {token.creditClientId}
                </p>
                <p>
                  <strong>Client Secret:</strong> {token.creditClientSecret}
                </p>
                <h4 className="text-white bg-green-500 rounded-[6px] text-[15px] font-semibold mt-4 p-3 text-center ">Credit Token Created Sucessfully.</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTokenModal;