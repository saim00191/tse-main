import type React from "react";
import { MdClose, MdArrowBack, MdInfo, MdCheckCircle } from "react-icons/md";
import { CreateModalProps } from '@/types/Token-Table'

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  creditClientSecret,
  confirmationInput,
  fetchedData,
  isLoading,
  isCreating,
  error,
  creationResult,
  isCreateConfirmationValid,
  getCreateTransform,
  closeCreateModal,
  handleCreateNextStep,
  handleCreateBackToDetails,
  handleCreateTSE,
  setCreditClientSecret,
  setConfirmationInput,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={closeCreateModal}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: getCreateTransform(),
            width: "300%",
          }}
        >
          <div className="w-1/3 flex-shrink-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Create TSEs
                </h2>
                <button
                  onClick={closeCreateModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateNextStep} className="p-6 space-y-6">
              {isLoading && (
                <div className="text-center text-gray-600">Loading...</div>
              )}
              {error && (
                <div className="text-center text-red-600">{error}</div>
              )}
              {fetchedData && (
                <>
                  <div>
                    <label
                      htmlFor="creditClientToken"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Credit Client Token
                    </label>
                    <input
                      type="text"
                      id="creditClientToken"
                      value={fetchedData.creditClientId || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This field is auto-filled and cannot be edited
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="creditClientSecret"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Credit Client Secret
                    </label>
                    <input
                      type="text"
                      id="creditClientSecret"
                      value={creditClientSecret}
                      onChange={(e) =>
                        setCreditClientSecret(e.target.value)
                      }
                      placeholder="Enter credit client secret"
                      readOnly
                      className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This field is auto-filled and cannot be edited
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="metadata"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Metadata
                    </label>
                    <input
                      type="text"
                      id="metadata"
                      value={fetchedData.metadata || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This field is auto-filled and cannot be edited
                    </p>
                  </div>
                </>
              )}
              {!isLoading && !error && !fetchedData && (
                <div className="text-center text-gray-600">
                  No data available
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!fetchedData}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>

          <div className="w-1/3 flex-shrink-0">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCreateBackToDetails}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <MdArrowBack className="text-xl" />
                  </button>
                  <h2 className="text-xl font-bold text-white">
                    Confirm TSE Creation
                  </h2>
                </div>
                <button
                  onClick={closeCreateModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <MdInfo className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you really want to create TSE?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  This action will create a new TSE with the provided
                  information. Please type "create tse" to confirm.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="confirmationInput"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type "create tse" to confirm
                </label>
                <input
                  type="text"
                  id="confirmationInput"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="create tse"
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {confirmationInput && !isCreateConfirmationValid && (
                  <p className="text-xs text-red-500 mt-1">
                    Please type exactly "create tse" to proceed
                  </p>
                )}
                {isCreateConfirmationValid && (
                  <p className="text-xs text-green-500 mt-1">
                    ✓ Confirmation text is correct
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCreateBackToDetails}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateTSE}
                  disabled={!isCreateConfirmationValid || isCreating}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isCreateConfirmationValid && !isCreating
                      ? "text-white bg-red-600 hover:bg-red-700"
                      : "text-gray-400 bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  {isCreating ? "Creating..." : "Create TSE"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-1/3 flex-shrink-0">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  TSE Created Successfully!
                </h2>
                <button
                  onClick={closeCreateModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 text-center">
              <div className="animate-bounce">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <MdCheckCircle className="text-green-600 text-4xl" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 animate-fadeInUp">
                  🎉 Success!
                </h3>
                <p
                  className="text-lg text-gray-700 animate-fadeInUp"
                  style={{ animationDelay: "0.2s" }}
                >
                  TSE Created Successfully
                </p>
              </div>

              <div
                className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeInUp"
                style={{ animationDelay: "0.4s" }}
              >
                <p className="text-sm text-green-800 font-medium">
                  Creation ID:
                </p>
                <p className="text-lg font-mono text-green-900 break-all">
                  {creationResult}
                </p>
              </div>

              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="text-sm text-gray-600">
                  Your TSE has been successfully created and will become
                  active in the system within 2 to 3 minutes. For quicker
                  visibility, please consider refreshing the page.
                </p>
              </div>

              <div
                className="pt-4 animate-fadeInUp"
                style={{ animationDelay: "0.8s" }}
              >
                <button
                  onClick={closeCreateModal}
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;