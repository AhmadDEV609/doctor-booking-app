import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
    FaGoogle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import {
    Mail,
    Lock,
    HeartPulse,
} from "lucide-react";
import { login } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(AuthContext)
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await login(form);


            alert('login successfully')
            setForm({
                email: '',
                password: ''
            })

            setUser(res.user)

            if (res.role === 'patient') {
                navigate('/Patient')
            }
            if (res.role === 'admin') {
                navigate('/Admin')
            }
            if (res.role === 'doctor') {
                navigate('/Doctor')
            }
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");
        }
    };
    return (

        <section className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-emerald-50 flex items-center justify-center px-5 py-10">

            <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

                {/* Left Side */}

                <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-cyan-500 via-teal-500 to-emerald-500 p-14 text-white relative overflow-hidden">

                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>

                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full"></div>

                    <div className="relative z-10">

                        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-8">

                            <HeartPulse
                                className="text-cyan-600"
                                size={40}
                            />

                        </div>

                        <h1 className="text-5xl font-black leading-tight">

                            Welcome
                            <br />
                            Back

                        </h1>

                        <p className="mt-8 text-lg leading-8 text-cyan-50">

                            Login to access your appointments,
                            AI Medical Assistant,
                            and healthcare records.

                        </p>

                        <div className="mt-14 space-y-6">

                            <div className="flex items-center gap-4">

                                <div className="w-3 h-3 rounded-full bg-white"></div>

                                <span>Book Doctors Anytime</span>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="w-3 h-3 rounded-full bg-white"></div>

                                <span>AI Medical Assistant</span>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="w-3 h-3 rounded-full bg-white"></div>

                                <span>Secure Health Records</span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="p-8 lg:p-14">

                    <div className="text-center lg:text-left">

                        <h2 className="text-4xl font-black text-slate-800">

                            Login

                        </h2>

                        <p className="text-slate-500 mt-3">

                            Welcome back! Please login to continue.

                        </p>

                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}

                        <div>

                            <label className="font-medium text-slate-700">

                                Email Address

                            </label>

                            <div className="mt-2 flex items-center border rounded-2xl px-4 h-14 focus-within:border-cyan-500">

                                <Mail
                                    className="text-slate-400"
                                    size={20}
                                />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 outline-none ml-3"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div>

                            <label className="font-medium text-slate-700">

                                Password

                            </label>

                            <div className="mt-2 flex items-center border rounded-2xl px-4 h-14 focus-within:border-cyan-500">

                                <Lock
                                    className="text-slate-400"
                                    size={20}
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter password"
                                    className="flex-1 outline-none ml-3"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >

                                    {
                                        showPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>

                        {/* Remember */}

                        <div className="flex justify-between items-center">

                            <label className="flex items-center gap-2">

                                <input type="checkbox" />

                                <span className="text-slate-600">

                                    Remember me

                                </span>

                            </label>

                            <Link
                                className="text-cyan-600 font-semibold"
                            >

                                Forgot Password?

                            </Link>

                        </div>

                        {/* Login */}

                        <button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:scale-[1.02] transition"
                        >

                            Login

                        </button>





                        <p className="text-center text-slate-600">

                            Don't have an account?

                            <Link
                                to="/signup"
                                className="text-cyan-600 font-bold ml-2"
                            >

                                Sign Up

                            </Link>

                        </p>

                    </form>

                </div>

            </div>

        </section>

    );

};

export default Login;