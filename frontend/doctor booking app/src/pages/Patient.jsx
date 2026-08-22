import React from "react";
import {
    Stethoscope,
    CalendarDays,
    CreditCard,
    ArrowRight,
    Search,
    HeartPulse,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Patient = () => {

    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================= HERO / WELCOME ================= */}

            <section className="relative overflow-hidden bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500">

                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">

                    <div className="max-w-3xl">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-medium mb-6">

                            <HeartPulse size={17} />

                            Your health, our priority

                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">

                            Welcome back,{" "}

                            <span className="text-white/90">
                                {user?.name || "Patient"}
                            </span>

                        </h1>

                        <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl">

                            Manage your appointments, find trusted doctors,
                            and take control of your healthcare journey with
                            CareSync AI.

                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">

                            <Link
                                to="/doctors"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-600 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                            >

                                <Search size={19} />

                                Find a Doctor

                                <ArrowRight size={18} />

                            </Link>

                            <Link
                                to="/patient"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition duration-300"
                            >

                                <CalendarDays size={19} />

                                My Appointments

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

                <div className="mb-8">

                    <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
                        Quick Access
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                        Manage your healthcare
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Everything you need is just one click away.
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Find Doctor */}

                    <Link
                        to="/doctors"
                        className="group bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">

                            <Stethoscope size={27} />

                        </div>

                        <h3 className="text-xl font-bold text-slate-800">
                            Find a Doctor
                        </h3>

                        <p className="text-slate-500 mt-2 leading-relaxed">
                            Explore qualified doctors and choose the right
                            specialist for your healthcare needs.
                        </p>

                        <div className="flex items-center gap-2 text-emerald-600 font-semibold mt-6">

                            Explore Doctors

                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>


                    {/* Appointments */}

                    <Link
                        to="/patient"
                        className="group bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">

                            <CalendarDays size={27} />

                        </div>

                        <h3 className="text-xl font-bold text-slate-800">
                            My Appointments
                        </h3>

                        <p className="text-slate-500 mt-2 leading-relaxed">
                            View your upcoming appointments and keep track
                            of your scheduled consultations.
                        </p>

                        <div className="flex items-center gap-2 text-cyan-600 font-semibold mt-6">

                            View Appointments

                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>


                    {/* Payments */}

                    <Link
                        to="/patient/payments"
                        className="group bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >

                        <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">

                            <CreditCard size={27} />

                        </div>

                        <h3 className="text-xl font-bold text-slate-800">
                            Payments
                        </h3>

                        <p className="text-slate-500 mt-2 leading-relaxed">
                            Check your consultation payments and keep your
                            payment history organized.
                        </p>

                        <div className="flex items-center gap-2 text-teal-600 font-semibold mt-6">

                            View Payments

                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition"
                            />

                        </div>

                    </Link>

                </div>

            </section>


            {/* ================= HEALTHCARE CTA ================= */}

            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-14">

                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-7 sm:px-10 py-10">

                    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-7">

                        <div className="max-w-2xl">

                            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">

                                <HeartPulse size={19} />

                                CareSync AI

                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-white">

                                Take the next step towards better health.

                            </h2>

                            <p className="text-slate-400 mt-3 leading-relaxed">

                                Find the right healthcare professional and
                                schedule your consultation whenever you need it.

                            </p>

                        </div>

                        <Link
                            to="/doctors"
                            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition duration-300"
                        >

                            Browse Doctors

                            <ArrowRight size={18} />

                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Patient;
