import type React from "react";
import { MdClose, MdInfo, MdCheckCircle } from "react-icons/md";
import { TerminateModalProps } from "@/types/Token-Table";

const TerminateModal: React.FC<TerminateModalProps> = ({
  isOpen,
  terminateModalStep,
  selectedToken,
  terminateConfirmationInput,
  isTerminating,
  error,
  terminationResult,
  isTerminateConfirmationValid,
  getTerminateTransform,
  closeTerminateModal,
  handleTerminateCreditToken,
  setTerminateConfirmationInput,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={closeTerminateModal}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: getTerminateTransform(),
            width: "200%",
          }}
        >
          <div className="w-1/2 flex-shrink-0">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Confirm Termination
                </h2>
                <button
                  onClick={closeTerminateModal}
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
                  Do you really want to terminate this credit token?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  This action will terminate the credit token with ID:{" "}
                  <span className="font-mono">
                    {selectedToken?.creditClientId}
                  </span>
                  . Please type <b>yes terminate</b> to confirm.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="terminateConfirmationInput"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type <b>yes terminate</b> to confirm
                </label>
                <input
                  type="text"
                  id="terminateConfirmationInput"
                  value={terminateConfirmationInput}
                  onChange={(e) =>
                    setTerminateConfirmationInput(e.target.value)
                  }
                  placeholder="yes terminate"
                  disabled={isTerminating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {terminateConfirmationInput &&
                  !isTerminateConfirmationValid && (
                    <p className="text-xs text-red-500 mt-1">
                      Please type exactly <b>yes terminate</b> to proceed
                    </p>
                  )}
                {isTerminateConfirmationValid && (
                  <p className="text-xs text-green-500 mt-1">
                    ✓ Confirmation text is correct
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeTerminateModal}
                  disabled={isTerminating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTerminateCreditToken}
                  disabled={!isTerminateConfirmationValid || isTerminating}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isTerminateConfirmationValid && !isTerminating
                      ? "text-white bg-red-600 hover:bg-red-700"
                      : "text-gray-400 bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  {isTerminating ? "Terminating..." : "Terminate"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex-shrink-0">
            <div
              className={`bg-gradient-to-r ${terminateModalStep === "success" ? "from-green-600 to-emerald-600" : "from-red-600 to-orange-600"} px-6 py-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {terminateModalStep === "success"
                    ? "Termination Successful!"
                    : "Termination Failed"}
                </h2>
                <button
                  onClick={closeTerminateModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 text-center">
              <div className="animate-bounce">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse ${terminateModalStep === "success" ? "bg-green-100" : "bg-red-100"}`}
                >
                  <MdCheckCircle
                    className={`${terminateModalStep === "success" ? "text-green-600" : "text-red-600"} text-4xl`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 animate-fadeInUp">
                  {terminateModalStep === "success"
                    ? "🎉 Success!"
                    : "❌ Error"}
                </h3>
                <p
                  className="text-lg text-gray-700 animate-fadeInUp"
                  style={{ animationDelay: "0.2s" }}
                >
                  {terminateModalStep === "success"
                    ? "Credit Token Terminated Successfully"
                    : "Failed to Terminate Credit Token"}
                </p>
              </div>

              {terminateModalStep === "success" && (
                <div
                  className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeInUp"
                  style={{ animationDelay: "0.4s" }}
                >
                  <p className="text-sm text-green-800 font-medium">
                    Termination ID:
                  </p>
                  <p className="text-lg font-mono text-green-900 break-all">
                    {terminationResult}
                  </p>
                </div>
              )}

              {terminateModalStep === "error" && error && (
                <div
                  className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeInUp"
                  style={{ animationDelay: "0.4s" }}
                >
                  <p className="text-sm text-red-800 font-medium">Error:</p>
                  <p className="text-lg font-mono text-red-900 break-all">
                    {error}
                  </p>
                </div>
              )}

              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="text-sm text-gray-600">
                  {terminateModalStep === "success"
                    ? "The credit token has been terminated and will be updated in the system within 2 to 3 minutes.For quicker visibility, please consider refreshing the page."
                    : "Please try again or contact support if the issue persists."}
                </p>
              </div>

              <div
                className="pt-4 animate-fadeInUp"
                style={{ animationDelay: "0.8s" }}
              >
                <button
                  onClick={closeTerminateModal}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${terminateModalStep === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
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

export default TerminateModal;