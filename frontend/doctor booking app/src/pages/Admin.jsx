import React, { useContext } from "react";
import {
    ShieldCheck,
    Users,
    Stethoscope,
    CalendarDays,
    ArrowRight,
    Activity,
    UserCheck,
    Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {

    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================= HERO SECTION ================= */}

            <section className="relative overflow-hidden">

                {/* Background Decoration */}

                <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />

                <div className="absolute top-40 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14">

                    <div className="grid lg:grid-cols-2 gap-10 items-center">

                        {/* Left */}

                        <div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-5">

                                <ShieldCheck size={17} />

                                Admin Dashboard

                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">

                                Welcome back,{" "}

                                <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">

                                    {user?.name || "Admin"}

                                </span>

                            </h1>

                            <p className="mt-5 text-slate-600 text-base sm:text-lg leading-7 max-w-xl">

                                Manage doctors, users, appointments and approvals
                                from one secure healthcare administration platform.
                            </p>

                            <div className="flex flex-wrap gap-3 mt-7">

                                <Link
                                    to="/admin/doctors"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition"
                                >
                                    Manage Doctors
                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    to="/admin/approvals"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-emerald-300 hover:text-emerald-600 transition"
                                >
                                    View Approvals
                                </Link>

                            </div>

                        </div>

                        {/* Right */}

                        <div className="hidden lg:flex justify-center">

                            <div className="relative w-full max-w-md">

                                <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-cyan-400 rounded-4xl blur-2xl opacity-20" />

                                <div className="relative bg-white rounded-4xl border border-slate-200 shadow-xl p-7">

                                    <div className="flex items-center justify-between mb-7">

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                System Overview
                                            </p>

                                            <h2 className="text-xl font-bold text-slate-800 mt-1">
                                                CareSync AI
                                            </h2>

                                        </div>

                                        <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">

                                            <Activity size={23} />

                                        </div>

                                    </div>

                                    <div className="space-y-4">

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50">

                                            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                                <Stethoscope size={21} />

                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Doctor Management
                                                </p>
                                                <p className="font-semibold text-slate-800">
                                                    Review & Approve
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-50">

                                            <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">

                                                <Users size={21} />

                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    User Management
                                                </p>
                                                <p className="font-semibold text-slate-800">
                                                    Monitor Users
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">

                                            <div className="w-11 h-11 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">

                                                <CalendarDays size={21} />

                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Appointments
                                                </p>
                                                <p className="font-semibold text-slate-800">
                                                    Track Activity
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= QUICK MANAGEMENT ================= */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-14">

                <div className="mb-7">

                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                        Administration
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                        Quick Management
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Access the most important administration tools quickly.
                    </p>

                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* Doctors */}

                    <Link
                        to="/admin/doctors"
                        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition">

                            <Stethoscope size={23} />

                        </div>

                        <h3 className="font-bold text-lg text-slate-800">
                            Doctors
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 leading-6">
                            Manage registered doctors and their profiles.
                        </p>

                        <div className="flex items-center gap-1 mt-5 text-sm font-semibold text-emerald-600">

                            Manage

                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>


                    {/* Approvals */}

                    <Link
                        to="/admin/approvals"
                        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:bg-cyan-500 group-hover:text-white transition">

                            <UserCheck size={23} />

                        </div>

                        <h3 className="font-bold text-lg text-slate-800">
                            Approvals
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 leading-6">
                            Review doctor profiles waiting for approval.
                        </p>

                        <div className="flex items-center gap-1 mt-5 text-sm font-semibold text-cyan-600">

                            Review

                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>


                    {/* Users */}

                    <Link
                        to="/admin/users"
                        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:text-white transition">

                            <Users size={23} />

                        </div>

                        <h3 className="font-bold text-lg text-slate-800">
                            Users
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 leading-6">
                            View and manage registered platform users.
                        </p>

                        <div className="flex items-center gap-1 mt-5 text-sm font-semibold text-blue-600">

                            Manage

                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>


                    {/* Appointments */}

                    <Link
                        to="/admin/appointments"
                        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5 group-hover:bg-violet-500 group-hover:text-white transition">

                            <Clock3 size={23} />

                        </div>

                        <h3 className="font-bold text-lg text-slate-800">
                            Appointments
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 leading-6">
                            Monitor appointment activity across the platform.
                        </p>

                        <div className="flex items-center gap-1 mt-5 text-sm font-semibold text-violet-600">

                            View Activity

                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>

                </div>

            </section>


            {/* ================= ADMIN INFO ================= */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16">

                <div className="rounded-4xl bg-linear-to-r from-slate-900 to-slate-800 p-7 sm:p-10 text-white relative overflow-hidden">

                    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>

                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">

                                    <ShieldCheck size={20} />

                                </div>

                                <span className="font-semibold text-emerald-400">
                                    Secure Administration
                                </span>

                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold">
                                Keep CareSync AI running smoothly
                            </h2>

                            <p className="text-slate-400 mt-2 max-w-2xl">
                                Manage healthcare professionals, verify profiles
                                and monitor platform activity from your admin
                                workspace.
                            </p>

                        </div>

                        <Link
                            to="/admin/doctors"
                            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-800 font-semibold hover:bg-emerald-50 transition"
                        >
                            Open Management
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );

};

export default Admin;