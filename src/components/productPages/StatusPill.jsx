// StatusPill.jsx
export default function StatusPill({ status, isCurrent, isBehind }) {
    if (!status) return null;


    var bgColor = (isBehind || isCurrent) ? status.colorHexCode : "#E5E7EB";



    return (
        <div className={`relative inline-block group hover:cursor-pointer hover:scale-105 transition-transform duration-150" `}>
            {/* The pill itself */}
            <div
                className={`p-4 rounded-full font-medium text-lg ${isBehind ? "opacity-40" : ""}`}
                style={{ backgroundColor: bgColor, color: "black", }}
            >
                {status.name ?? "Unknown status"}
            </div>

            {/* Tooltip */}
            <div
                className="
          pointer-events-none
          absolute left-1/2 top-xl mt-2 -translate-x-1/2
          z-20
          w-max max-w-xs
          rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-lg
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
        "
            >
                <div className="flex justify-center flex-col items-center space-y-2">
                    <p className="text-black text-2xl">{status.description || "No description available."}</p>
                     <p className="text-lg">Click to set status</p> 
                </div>

            </div>
        </div>
    );
}
