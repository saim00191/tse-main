import { MdCancel, MdCheckCircle } from "react-icons/md";

export const getStatusBadge = (status?: string) => {
  const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
  if (!status) {
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
        <MdCancel className="text-gray-500" />
        Unknown
      </span>
    );
  }
  if (status.toLowerCase() === "active") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        <MdCheckCircle className="text-green-500 " />
        Active
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-red-100 text-red-800`}>
      <MdCancel className="text-red-500" />
      Terminated
    </span>
  );
};
