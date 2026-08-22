import {
    Menu,
    X,
    ChevronDown,
    Home,
    Stethoscope,
    CalendarDays,
    CreditCard,
    LayoutDashboard,
    ShieldCheck,
    Users,
    ClipboardList,
    User,
    LogOut,
    Info,
    Phone,
} from "lucide-react";

import {
    Link,
    NavLink,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth.api";

const Navbar = () => {

    const { user, setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const location = useLocation();

    const [mobileMenu, setMobileMenu] = useState(false);

    const [profileMenu, setProfileMenu] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {

        const close = (e) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setProfileMenu(false);
            }

        };

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);

    }, []);

    const handleLogout = async () => {

        try {

            await logout();

            setUser(null);

            navigate("/login");

        } catch (error) {

            console.log(error);

        }

    };

    const links = useMemo(() => {

        if (!user) {

            return [

                {
                    name: "Home",
                    to: "/",
                    icon: Home,
                },

                {
                    name: "Doctors",
                    to: "/doctors",
                    icon: Stethoscope,
                },

                {
                    name: "About",
                    to: "/about",
                    icon: Info,
                },

                {
                    name: "Contact",
                    to: "/contact",
                    icon: Phone,
                },

            ];

        }

        if (user.role === "patient") {

            return [

                {
                    name: "Home",
                    to: "/",
                    icon: Home,
                },

                {
                    name: "Doctors",
                    to: "/doctors",
                    icon: Stethoscope,
                },

                {
                    name: "Home",
                    to: "/patient",
                    icon: CalendarDays,
                },

                {
                    name: "MyAppointments",
                    to: "/appointments",
                    icon: CreditCard,
                },

            ];

        }

        if (user.role === "doctor") {

            return [

                {
                    name: "Dashboard",
                    to: "/doctor",
                    icon: LayoutDashboard,
                },

                {
                    name: "Appointments",
                    to: "/doctor/appointments",
                    icon: CalendarDays,
                },

                {
                    name: "Complete Profile",
                    to: "/doctor/profile",
                    icon: User,
                },

                {
                    name: "About",
                    to: "/about",
                    icon: ClipboardList,
                },

            ];

        }

        return [

            {
                name: "Home",
                to: "/admin",
                icon: LayoutDashboard,
            },

            {
                name: "Doctors",
                to: "/admin/doctors",
                icon: Stethoscope,
            },
            {
                name: "Appointments",
                to: "/admin/appointments",
                icon: CalendarDays,
            },




        ];

    }, [user]);

    return (

        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                <div className="h-20 flex items-center justify-between">

                    {/* Logo */}

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >

                        <div className="h-11 w-11 rounded-2xl bg-linear-to-r from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">

                            D

                        </div>

                        <div>

                            <h2 className="font-bold text-xl text-slate-800">

                                CareSync AI

                            </h2>

                            <p className="text-xs text-slate-500">

                                Smart Healthcare

                            </p>

                        </div>

                    </Link>

                    {/* Desktop Links */}

                    <ul className="hidden lg:flex items-center gap-8">

                        {links.map((item) => (

                            <li key={item.name}>

                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `font-medium transition duration-300 ${isActive
                                            ? "text-emerald-600"
                                            : "text-slate-700 hover:text-emerald-600"
                                        }`
                                    }
                                >

                                    {item.name}

                                </NavLink>

                            </li>

                        ))}

                    </ul>

                    {/* Right Side Starts */}
                    <div className="flex items-center gap-4">

                        {!user ? (

                            <>

                                <Link
                                    to="/login"
                                    className="hidden lg:block font-semibold text-slate-700 hover:text-emerald-600 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="hidden lg:flex items-center justify-center px-6 py-3 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 duration-300"
                                >
                                    Get Started
                                </Link>

                            </>

                        ) : (

                            <div
                                ref={dropdownRef}
                                className="relative hidden lg:block"
                            >

                                <button
                                    onClick={() => setProfileMenu(!profileMenu)}
                                    className="flex items-center gap-3"
                                >

                                    {user.image ? (

                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                                        />

                                    ) : (

                                        <div className="w-11 h-11 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 text-white flex items-center justify-center font-bold uppercase">
                                            {user.name?.charAt(0)}
                                        </div>

                                    )}

                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">
                                            {user.name}
                                        </h3>

                                        <p className="text-xs capitalize text-slate-500">
                                            {user.role}
                                        </p>
                                    </div>

                                    <ChevronDown
                                        size={18}
                                        className={`transition ${profileMenu ? "rotate-180" : ""
                                            }`}
                                    />

                                </button>

                                {profileMenu && (

                                    <div className="absolute right-0 mt-4 w-60 rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">



                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-500 transition"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="lg:hidden"
                        >
                            {mobileMenu ? <X /> : <Menu />}
                        </button>

                    </div>
                </div>

                {mobileMenu && (

                    <div className="lg:hidden py-5 border-t border-slate-100">

                        <div className="flex flex-col gap-2">

                            {links.map((item) => {

                                const Icon = item.icon;

                                return (

                                    <NavLink
                                        key={item.name}
                                        to={item.to}
                                        onClick={() => setMobileMenu(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${isActive
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "hover:bg-slate-100 text-slate-700"
                                            }`
                                        }
                                    >

                                        <Icon size={18} />

                                        {item.name}

                                    </NavLink>

                                );

                            })}

                            {!user ? (

                                <>

                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenu(false)}
                                        className="mt-4 text-center py-3 rounded-xl border border-slate-300"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenu(false)}
                                        className="text-center py-3 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold"
                                    >
                                        Get Started
                                    </Link>

                                </>

                            ) : (

                                <button
                                    onClick={handleLogout}
                                    className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white"
                                >

                                    <LogOut size={18} />

                                    Logout

                                </button>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </nav>

    );

};

export default Navbar;


