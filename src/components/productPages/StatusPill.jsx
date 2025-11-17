// StatusPill.jsx
export default function StatusPill({ status, isCurrent, isBehind }) {
  if (!status) return null;

  
  var bgColor = null;
  
  if (isBehind) {
    bgColor = "#f7867e"; // Green for current status
  } else if (isCurrent) {
    bgColor = status.colorHexCode; // Red for behind status
  }
  else {
    bgColor = "#E5E7EB"; // Default or provided color
  }


  return (
    <div className="relative inline-block group">
      {/* The pill itself */}
      <div
        className="p-4 rounded-full font-medium text-lg "
        style={{ backgroundColor: bgColor, color: "black",  }}
      >
        {status.name ?? "Unknown status"}
      </div>

      {/* Tooltip */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-full mt-2 -translate-x-1/2
          z-20
          w-max max-w-xs
          rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-lg
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
        "
      >
        {status.description || "No description available."}
      </div>
    </div>
  );
}
