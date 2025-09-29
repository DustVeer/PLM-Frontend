

function Login() {
    return (
        <>
            <div className="flex justify-center align-middle mt-50">
                <div className="bg-white rounded-xl shadow-lg p-6 h-64 w-100" >
                    <h3 className="text-3xl font-bold text-indigo-800">Login</h3>
                    <form action="">
                        <div className="pt-2">
                            <input placeholder="Email" type="text" className="w-full rounded-xl p-2.5 border-violet-300 border-2" />
                        </div>
                         <div className="pt-2">
                            <input placeholder="Wachtwoord" type="password" className="w-full rounded-xl p-2.5 border-violet-300 border-2" />
                        </div>
                        <div className="flex justify-center align-middle pt-2">
                            <input type="submit" value="Login" className="bg-indigo-500 rounded-xl p-2 px-10 text-white"/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;