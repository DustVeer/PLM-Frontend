import { Link } from "react-router-dom";



function ProfilePage() {
    const userIds = [1,2,3,4,5]

    return (
        <div className="p-4">
            {userIds.map((userId) => (<Link key={userId} to={`/profiles/${userId}`} className="btn-primary m-2">Profile {userId}</Link>))}
        </div>
    );
}

export default ProfilePage;