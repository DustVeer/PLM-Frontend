import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password, remember);
            navigate("/"); 

            setLoading(false);
        } catch (err) {
            if(err.status === 401) {
                setError("Ongeldige inloggegevens");
            }
            else if (err.status === 500) {
                setError("Serverfout, probeer het later opnieuw");
            }
            else {
                setError("Er is een fout opgetreden: " + err.message);
            }

            setError(err.message);
            setLoading(false);
        }

    }

    return (
        <>
            <div className="flex justify-center align-middle mt-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-100" >
                    <h3 className="text-3xl font-bold text-indigo-800">Login</h3>
                    <form action="" onSubmit={handleSubmit} className="pt-4 space-y-4">
                        <div className="pt-2">
                            <input placeholder="Email" type="text" className="w-full rounded-xl p-2.5 border-violet-300 border-2" 
                            onChange={e => setEmail(e.target.value)}/>
                        </div>
                         <div className="pt-2">
                            <input placeholder="Wachtwoord" type="password" className="w-full rounded-xl p-2.5 border-violet-300 border-2" 
                            onChange={e => setPassword(e.target.value)}/>
                        </div>
                        <div className="pt-2">
                            
                            {error && <div className="flex justify-center align-middle border-2 rounded-xl border-red-400 p-2"><p className="text-red-500">{error}</p></div>}
                            {loading && <p>Loading...</p>}
                        </div>
                        <div className="flex justify-center align-middle">
                            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="bg-indigo-500 rounded-xl p-2 px-10 text-white"/>
                            <p className="ps-2">Onthoud mij?</p>
                        </div>
                        <div className="flex justify-center align-middle">
                            <input type="submit" value="Login" className="bg-indigo-500 rounded-xl p-2 px-10 text-white"/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;