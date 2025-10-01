import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="m-7 ">
            <h3 className="text-7xl font-bold mb-4">404 Not Found</h3>

            <Link to="/" className="btn-primary">Naar Dashboard</Link>
        </div>
    );
}

export default NotFoundPage;