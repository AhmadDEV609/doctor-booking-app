
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    HeartPulse,
    Settings,
    Stethoscope,
    UserRound,
    Users,
    ArrowRight,
    CircleAlert,
} from "lucide-react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";


const Doctor = () => {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();


    const doctorName = user?.name || "Doctor";


    return (

        <div className="min-h-screen bg-slate-50">


            {/* =====================================================
                HERO / WELCOME SECTION
            ===================================================== */}

            <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-cyan-50">

                {/* Decorative circles */}

                <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />

                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />


                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">


                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">


                        {/* Welcome */}

                        <div className="max-w-2xl">


                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-600 text-sm font-semibold mb-5">

                                <HeartPulse size={17} />

                                Doctor Dashboard

                            </div>


                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">

                                Welcome, Dr.{" "}

                                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-cyan-500">

                                    {doctorName}

                                </span>

                            </h1>


                            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">

                                Manage your professional profile, appointments,

                                availability and patient care from one place.

                            </p>


                        </div>


                        {/* Profile image */}

                        <div className="shrink-0">


                            {user?.image ? (

                                <img

                                    src={user.image}

                                    alt={doctorName}

                                    className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white shadow-xl"

                                />

                            ) : (

                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold uppercase shadow-xl border-4 border-white">

                                    {doctorName.charAt(0)}

                                </div>

                            )}

                        </div>


                    </div>

                </div>

            </section>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">


                {/* =================================================
                    APPROVAL STATUS
                ================================================= */}

                <div className="mb-8">


                    <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">


                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                            <div className="flex items-start gap-4">


                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">

                                    <CircleAlert size={23} />

                                </div>


                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Profile approval pending

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 leading-6">

                                        Complete your professional profile and

                                        submit the required information for admin

                                        approval.

                                    </p>

                                </div>


                            </div>


                            <button

                                onClick={() => navigate("/doctor/profile")}

                                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-md shadow-emerald-100 hover:shadow-lg hover:scale-[1.02] transition"

                            >

                                Complete Profile

                                <ArrowRight size={17} />

                            </button>


                        </div>

                    </div>

                </div>


                {/* =================================================
                    QUICK STATS
                ================================================= */}

                <section>


                    <div className="mb-5">

                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">

                            Overview

                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">

                            Your practice at a glance

                        </h2>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                        {/* Appointments */}

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition">


                            <div className="flex items-center justify-between">

                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                                    <CalendarDays size={22} />

                                </div>


                                <span className="text-xs font-semibold text-slate-400">

                                    Today

                                </span>

                            </div>


                            <p className="mt-5 text-3xl font-bold text-slate-900">

                                0

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                Appointments

                            </p>


                        </div>


                        {/* Patients */}

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition">


                            <div className="flex items-center justify-between">

                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">

                                    <Users size={22} />

                                </div>


                                <span className="text-xs font-semibold text-slate-400">

                                    Total

                                </span>

                            </div>


                            <p className="mt-5 text-3xl font-bold text-slate-900">

                                0

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                Patients

                            </p>


                        </div>


                        {/* Reviews */}

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition">


                            <div className="flex items-center justify-between">

                                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">

                                    <FileText size={22} />

                                </div>


                                <span className="text-xs font-semibold text-slate-400">

                                    Overall

                                </span>

                            </div>


                            <p className="mt-5 text-3xl font-bold text-slate-900">

                                0

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                Reviews

                            </p>


                        </div>


                        {/* Availability */}

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition">


                            <div className="flex items-center justify-between">

                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">

                                    <Clock3 size={22} />

                                </div>


                                <span className="text-xs font-semibold text-slate-400">

                                    Status

                                </span>

                            </div>


                            <p className="mt-5 text-lg font-bold text-amber-600">

                                Not Set

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                Availability

                            </p>


                        </div>


                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="mt-12">


                    <div className="mb-5">

                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">

                            Quick Actions

                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">

                            Manage your practice

                        </h2>

                    </div>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">


                        {/* Profile */}

                        <button

                            onClick={() => navigate("/doctor/profile")}

                            className="group text-left bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                        >

                            <div className="flex items-center justify-between">


                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                                    <UserRound size={22} />

                                </div>


                                <ArrowRight

                                    size={20}

                                    className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition"

                                />

                            </div>


                            <h3 className="mt-5 text-lg font-bold text-slate-900">

                                Complete Profile

                            </h3>


                            <p className="mt-2 text-sm text-slate-500 leading-6">

                                Add your speciality, experience, fee,

                                license and professional information.

                            </p>


                        </button>


                        {/* Appointments */}

                        <button

                            onClick={() => navigate("/doctor/appointments")}

                            className="group text-left bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                        >

                            <div className="flex items-center justify-between">


                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">

                                    <CalendarDays size={22} />

                                </div>


                                <ArrowRight

                                    size={20}

                                    className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition"

                                />

                            </div>


                            <h3 className="mt-5 text-lg font-bold text-slate-900">

                                Appointments

                            </h3>


                            <p className="mt-2 text-sm text-slate-500 leading-6">

                                Review your upcoming appointments and

                                manage your patient schedule.

                            </p>


                        </button>


                        {/* Availability */}

                        <button

                            onClick={() => navigate("/doctor/profile")}

                            className="group text-left bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                        >

                            <div className="flex items-center justify-between">


                                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">

                                    <Clock3 size={22} />

                                </div>


                                <ArrowRight

                                    size={20}

                                    className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition"

                                />

                            </div>


                            <h3 className="mt-5 text-lg font-bold text-slate-900">

                                Set Availability

                            </h3>


                            <p className="mt-2 text-sm text-slate-500 leading-6">

                                Configure your available days and consultation

                                timings for patients.

                            </p>


                        </button>


                    </div>

                </section>




                <section className="mt-12">


                    <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-emerald-500 to-cyan-500 p-8 md:p-10 text-white">


                        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />

                        <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-white/10" />


                        <div className="relative">


                            <div className="flex items-center gap-3">


                                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">

                                    <Stethoscope size={22} />

                                </div>


                                <p className="font-semibold text-white/80">

                                    CareSync AI

                                </p>

                            </div>


                            <h2 className="mt-5 text-2xl md:text-3xl font-bold">

                                Build your professional presence

                            </h2>


                            <p className="mt-3 max-w-2xl text-white/80 leading-7">

                                Complete your doctor profile with accurate

                                professional information and availability.

                                Once approved, patients will be able to discover

                                your profile and book appointments.

                            </p>


                            <button

                                onClick={() => navigate("/doctor/profile")}

                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-600 font-bold hover:bg-slate-50 transition shadow-lg"

                            >

                                Get Started

                                <ArrowRight size={17} />

                            </button>


                        </div>

                    </div>

                </section>


            </main>

        </div>

    );

};


export default Doctor;

