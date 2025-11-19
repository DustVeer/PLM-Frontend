


function StatusPillSmall({ label, color }) {
    return (
        <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
            style={{
                backgroundColor: color || "#E5E7EB", // gray-200
                borderColor: "#D1D5DB", // gray-300
            }}
        >
            {label}
        </span>
    );
}
export default StatusPillSmall