import React, { useEffect, useState } from "react";

import {
    CalendarDays,
    Clock3,
    UserRound,
    Stethoscope,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";


// =====================================================
// APPOINTMENTS COMPONENT
// =====================================================

const Appointments = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // GET USER APPOINTMENTS
    // =====================================================

    useEffect(() => {

        const getAppointments = async () => {

            try {

                setLoading(true);

                setError("");


                const { data } = await api.get(
                    "/appointments/my"
                );


                setAppointments(
                    data?.appointments || []
                );


            } catch (error) {

                console.error(
                    "Get appointments error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Unable to load your appointments."
                );


            } finally {

                setLoading(false);

            }

        };


        getAppointments();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

                    <div className="animate-pulse">

                        {/* Header */}

                        <div className="mb-8">

                            <div className="h-8 w-52 rounded-lg bg-slate-200" />

                            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />

                        </div>


                        {/* Cards */}

                        <div className="space-y-5">

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="rounded-3xl border border-slate-200 bg-white p-6"
                                >

                                    <div className="flex gap-5">

                                        <div className="h-20 w-20 rounded-2xl bg-slate-200" />

                                        <div className="flex-1 space-y-3">

                                            <div className="h-5 w-48 rounded bg-slate-200" />

                                            <div className="h-4 w-32 rounded bg-slate-200" />

                                            <div className="h-4 w-64 rounded bg-slate-200" />

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                        <XCircle size={30} />

                    </div>


                    <h2 className="mt-5 text-xl font-bold text-slate-900">

                        Unable to load appointments

                    </h2>


                    <p className="mt-2 text-sm leading-6 text-slate-500">

                        {error}

                    </p>


                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                    >

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-cyan-50">

                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />


                <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

                    <button
                        type="button"
                        onClick={() => navigate("/doctors")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
                    >

                        <ArrowLeft size={18} />

                        Back to Doctors

                    </button>


                    <div>

                        <p className="text-sm font-semibold text-emerald-600">

                            My Healthcare

                        </p>


                        <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">

                            My Appointments

                        </h1>


                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">

                            View and manage all your upcoming and previous doctor appointments.

                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {appointments.length === 0 ? (

                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-16">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">

                            <CalendarDays size={36} />

                        </div>


                        <h2 className="mt-6 text-2xl font-bold text-slate-900">

                            No appointments yet

                        </h2>


                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">

                            You have not booked any appointment yet. Find a doctor and schedule your first consultation.

                        </p>


                        <button
                            type="button"
                            onClick={() => navigate("/doctors")}
                            className="mt-7 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-100 transition hover:shadow-xl"
                        >

                            Find a Doctor

                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">


                        {/* =================================================
                            APPOINTMENTS
                        ================================================= */}

                        {appointments.map((appointment) => {

                            const doctor =
                                appointment?.doctorId;

                            const doctorUser =
                                doctor?.userId;


                            return (

                                <AppointmentCard
                                    key={appointment._id}
                                    appointment={appointment}
                                    doctor={doctor}
                                    doctorUser={doctorUser}
                                />

                            );

                        })}

                    </div>

                )}

            </main>

        </div>

    );

};


// =====================================================
// APPOINTMENT CARD
// =====================================================

const AppointmentCard = ({
    appointment,
    doctor,
    doctorUser,
}) => {


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        appointment?.status || "pending";


    const statusData =
        getStatusData(status);


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">


            {/* =================================================
                TOP
            ================================================= */}

            <div className="p-5 sm:p-6 lg:p-7">


                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                    {/* =================================================
                        DOCTOR
                    ================================================= */}

                    <div className="flex items-start gap-4">


                        {/* IMAGE */}

                        {doctorUser?.image ? (

                            <img
                                src={doctorUser.image}
                                alt={
                                    doctorUser?.name ||
                                    "Doctor"
                                }
                                className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 object-cover shadow-sm"
                            />

                        ) : (

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 text-2xl font-bold text-white shadow-sm">

                                {doctorUser?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "D"}

                            </div>

                        )}


                        {/* DOCTOR INFO */}

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                <h2 className="text-xl font-bold text-slate-900">

                                    Dr.{" "}

                                    {doctorUser?.name ||
                                        "Doctor"}

                                </h2>


                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-600">

                                    <CheckCircle2 size={13} />

                                    {status}

                                </span>

                            </div>


                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">

                                <Stethoscope size={15} />

                                {doctor?.speciality ||
                                    "Healthcare Specialist"}

                            </p>


                            {doctorUser?.city && (

                                <p className="mt-2 text-sm text-slate-500">

                                    {doctorUser.city}

                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        className={`inline - w - fit items - center gap - 2 rounded - xl border px - 4 py - 2.5 text - sm font - semibold ${statusData.className} `}
                    >

                        <statusData.Icon size={17} />

                        <span className="capitalize">

                            {status}

                        </span>

                    </div>

                </div>


                {/* =================================================
                    APPOINTMENT DETAILS
                ================================================= */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">


                    {/* DATE */}

                    <InfoBox
                        icon={CalendarDays}
                        label="Date"
                        value={
                            formatDate(
                                appointment.date
                            )
                        }
                    />


                    {/* DAY */}

                    <InfoBox
                        icon={CalendarDays}
                        label="Day"
                        value={
                            appointment.day ||
                            "Not available"
                        }
                    />


                    {/* TIME */}

                    <InfoBox
                        icon={Clock3}
                        label="Time"
                        value={
                            `${appointment.startTime} - ${appointment.endTime} `
                        }
                    />


                    {/* PAYMENT */}

                    <InfoBox
                        icon={CreditCard}
                        label="Payment"
                        value={
                            appointment.paymentMethod ||
                            "Cash"
                        }
                    />

                </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">

                <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                    <span>

                        Appointment ID:{" "}

                        <span className="font-medium text-slate-500">

                            {appointment._id}

                        </span>

                    </span>


                    <span className="flex items-center gap-1.5">

                        <UserRound size={13} />

                        Consultation with Dr.{" "}

                        {doctorUser?.name ||
                            "Doctor"}

                    </span>

                </div>

            </div>

        </div>

    );

};


// =====================================================
// INFO BOX
// =====================================================

const InfoBox = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                    <Icon size={17} />

                </div>


                <div className="min-w-0">

                    <p className="text-xs text-slate-400">

                        {label}

                    </p>


                    <p className="mt-1 truncate text-sm font-bold capitalize text-slate-800">

                        {value}

                    </p>

                </div>

            </div>

        </div>

    );

};


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

    if (!date) {

        return "Not available";

    }


    const value =
        new Date(`${date} T00:00:00`);


    if (isNaN(value.getTime())) {

        return date;

    }


    return value.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );

};


// =====================================================
// STATUS DATA
// =====================================================

const getStatusData = (status) => {

    switch (status?.toLowerCase()) {

        case "approved":

            return {
                Icon: CheckCircle2,
                className:
                    "border-emerald-100 bg-emerald-50 text-emerald-600",
            };


        case "completed":

            return {
                Icon: CheckCircle2,
                className:
                    "border-cyan-100 bg-cyan-50 text-cyan-600",
            };


        case "cancelled":

            return {
                Icon: XCircle,
                className:
                    "border-red-100 bg-red-50 text-red-600",
            };


        case "rejected":

            return {
                Icon: XCircle,
                className:
                    "border-red-100 bg-red-50 text-red-600",
            };


        default:

            return {
                Icon: Clock,
                className:
                    "border-amber-100 bg-amber-50 text-amber-600",
            };

    }

};


export default Appointments;

