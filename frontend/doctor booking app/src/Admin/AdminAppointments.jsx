import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    Mail,
    RefreshCw,
    Search,
    Stethoscope,
    User,
    XCircle,
    Loader2
} from "lucide-react";

import {
    getAppointments,
    updateAppointment
} from "../api/admin.api";


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {
    pending: {
        label: "Pending",
        className:
            "bg-amber-50 text-amber-700 border-amber-200"
    },

    confirmed: {
        label: "Confirmed",
        className:
            "bg-blue-50 text-blue-700 border-blue-200"
    },

    completed: {
        label: "Completed",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200"
    },

    cancelled: {
        label: "Cancelled",
        className:
            "bg-red-50 text-red-700 border-red-200"
    }
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const AdminAppointments = () => {

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [updatingId, setUpdatingId] =
        useState(null);


    // =================================================
    // FETCH APPOINTMENTS
    // =================================================

    const fetchAppointments = async (
        showRefreshLoader = false
    ) => {

        try {

            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data =
                await getAppointments();

            setAppointments(
                data?.appointments || []
            );

        } catch (error) {

            console.error(
                "Appointments error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load appointments."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        fetchAppointments();

    }, []);


    // =================================================
    // UPDATE STATUS
    // =================================================

    const handleStatusChange = async (
        appointmentId,
        newStatus
    ) => {

        try {

            setUpdatingId(
                appointmentId
            );

            const data =
                await updateAppointment(
                    appointmentId,
                    newStatus
                );


            const updatedAppointment =
                data?.update;


            setAppointments(
                (previousAppointments) =>
                    previousAppointments.map(
                        (appointment) =>
                            appointment._id ===
                                appointmentId
                                ? {
                                    ...appointment,
                                    ...(updatedAppointment ||
                                        {}),
                                    status:
                                        newStatus
                                }
                                : appointment
                    )
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to update appointment status."
            );

        } finally {

            setUpdatingId(null);

        }

    };


    // =================================================
    // FILTER APPOINTMENTS
    // =================================================

    const filteredAppointments =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return appointments.filter(
                (appointment) => {

                    const patient =
                        appointment?.userId;

                    const doctor =
                        appointment?.doctorId;

                    const doctorUser =
                        doctor?.userId;


                    const searchableText = [
                        patient?.name,
                        patient?.email,
                        doctorUser?.name,
                        doctorUser?.email,
                        doctor?.speciality,
                        appointment?.date,
                        appointment?.status,
                        appointment?.paymentMethod
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        !searchValue ||
                        searchableText.includes(
                            searchValue
                        );


                    const matchesStatus =
                        statusFilter === "all" ||
                        appointment?.status ===
                        statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            appointments,
            search,
            statusFilter
        ]);


    // =================================================
    // STATISTICS
    // =================================================

    const statistics =
        useMemo(() => {

            return {
                total:
                    appointments.length,

                pending:
                    appointments.filter(
                        (item) =>
                            item.status ===
                            "pending"
                    ).length,

                confirmed:
                    appointments.filter(
                        (item) =>
                            item.status ===
                            "confirmed"
                    ).length,

                completed:
                    appointments.filter(
                        (item) =>
                            item.status ===
                            "completed"
                    ).length,

                cancelled:
                    appointments.filter(
                        (item) =>
                            item.status ===
                            "cancelled"
                    ).length
            };

        }, [appointments]);


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">

                <div className="mx-auto max-w-7xl">

                    <div className="animate-pulse space-y-7">

                        <div className="h-10 w-64 rounded-xl bg-slate-200" />

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                            {Array.from({
                                length: 5
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-28 rounded-2xl bg-white"
                                />
                            ))}

                        </div>


                        <div className="h-20 rounded-2xl bg-white" />

                        <div className="h-100 rounded-2xl bg-white" />

                    </div>

                </div>

            </div>
        );

    }


    // =================================================
    // ERROR
    // =================================================

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
                        onClick={() =>
                            fetchAppointments()
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white"
                    >

                        <RefreshCw size={17} />

                        Try Again

                    </button>

                </div>

            </div>
        );

    }


    // =================================================
    // MAIN UI
    // =================================================

    return (

        <div className="min-h-screen bg-slate-50">

            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">


                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 text-white shadow-md">

                                <CalendarDays
                                    size={23}
                                />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">

                                    Appointments

                                </h1>

                                <p className="mt-1 text-sm text-slate-500">

                                    Manage and monitor all patient appointments.

                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            fetchAppointments(true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* =====================================
                    STATISTICS
                ====================================== */}

                <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                    <StatCard
                        icon={CalendarDays}
                        label="Total"
                        value={
                            statistics.total
                        }
                        iconClass="bg-slate-100 text-slate-600"
                    />

                    <StatCard
                        icon={Clock3}
                        label="Pending"
                        value={
                            statistics.pending
                        }
                        iconClass="bg-amber-50 text-amber-600"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Confirmed"
                        value={
                            statistics.confirmed
                        }
                        iconClass="bg-blue-50 text-blue-600"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Completed"
                        value={
                            statistics.completed
                        }
                        iconClass="bg-emerald-50 text-emerald-600"
                    />

                    <StatCard
                        icon={XCircle}
                        label="Cancelled"
                        value={
                            statistics.cancelled
                        }
                        iconClass="bg-red-50 text-red-600"
                    />

                </section>


                {/* =====================================
                    FILTERS
                ====================================== */}

                <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search patient, doctor, email, speciality..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                            />

                        </div>


                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:bg-white"
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="confirmed">
                                Confirmed
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                </section>


                {/* =====================================
                    RESULT INFO
                ====================================== */}

                <div className="mt-6 flex items-center justify-between">

                    <div>

                        <p className="text-sm font-semibold text-slate-800">

                            {filteredAppointments.length}{" "}
                            appointment
                            {filteredAppointments.length !== 1
                                ? "s"
                                : ""}

                        </p>

                        <p className="text-xs text-slate-400">

                            Showing filtered results

                        </p>

                    </div>

                </div>


                {/* =====================================
                    EMPTY STATE
                ====================================== */}

                {filteredAppointments.length === 0 ? (

                    <div className="mt-5 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                            <CalendarDays
                                size={30}
                            />

                        </div>


                        <h2 className="mt-5 text-lg font-bold text-slate-800">

                            No appointments found

                        </h2>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                            No appointments match your current search or status filter.

                        </p>

                    </div>

                ) : (

                    <>

                        {/* =================================
                            DESKTOP TABLE
                        ================================== */}

                        <div className="mt-5 hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-225">

                                    <thead className="border-b border-slate-200 bg-slate-50">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                                                Patient

                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                                                Doctor

                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                                                Appointment

                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                                                Payment

                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                                                Status

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {filteredAppointments.map(
                                            (appointment) => (

                                                <AppointmentRow
                                                    key={
                                                        appointment._id
                                                    }
                                                    appointment={
                                                        appointment
                                                    }
                                                    updatingId={
                                                        updatingId
                                                    }
                                                    onStatusChange={
                                                        handleStatusChange
                                                    }
                                                />

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =================================
                            MOBILE / TABLET CARDS
                        ================================== */}

                        <div className="mt-5 grid gap-4 lg:hidden">

                            {filteredAppointments.map(
                                (appointment) => (

                                    <AppointmentCard
                                        key={
                                            appointment._id
                                        }
                                        appointment={
                                            appointment
                                        }
                                        updatingId={
                                            updatingId
                                        }
                                        onStatusChange={
                                            handleStatusChange
                                        }
                                    />

                                )
                            )}

                        </div>

                    </>

                )}

            </main>

        </div>
    );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    iconClass
}) => {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {label}

                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">

                        {value}

                    </p>

                </div>


                <div
                    className={`flex h - 11 w - 11 items - center justify - center rounded - xl ${iconClass} `}
                >

                    <Icon size={20} />

                </div>

            </div>

        </div>
    );
};


// =====================================================
// DESKTOP ROW
// =====================================================

const AppointmentRow = ({
    appointment,
    updatingId,
    onStatusChange
}) => {

    const patient =
        appointment?.userId;

    const doctor =
        appointment?.doctorId;

    const doctorUser =
        doctor?.userId;


    const isUpdating =
        updatingId === appointment?._id;


    return (

        <tr className="transition hover:bg-slate-50/70">


            {/* PATIENT */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                    <Avatar
                        user={patient}
                    />

                    <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-800">

                            {patient?.name ||
                                "Unknown Patient"}

                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">

                            <Mail size={12} />

                            {patient?.email ||
                                "No email"}

                        </p>

                    </div>

                </div>

            </td>


            {/* DOCTOR */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                    <Avatar
                        user={doctorUser}
                        doctor
                    />

                    <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-800">

                            Dr.{" "}
                            {doctorUser?.name ||
                                "Unknown Doctor"}

                        </p>

                        <p className="mt-1 text-xs text-emerald-600">

                            {doctor?.speciality ||
                                "Specialist"}

                        </p>

                    </div>

                </div>

            </td>


            {/* DATE/TIME */}

            <td className="px-6 py-5">

                <div className="space-y-1">

                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">

                        <CalendarDays
                            size={15}
                            className="text-emerald-500"
                        />

                        {formatDate(
                            appointment?.date
                        )}

                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">

                        <Clock3
                            size={14}
                        />

                        {appointment?.startTime ||
                            "--"}{" "}
                        -{" "}
                        {appointment?.endTime ||
                            "--"}

                    </div>

                </div>

            </td>


            {/* PAYMENT */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-2">

                    <DollarSign
                        size={16}
                        className="text-emerald-500"
                    />

                    <span className="text-sm font-semibold capitalize text-slate-700">

                        {appointment?.paymentMethod ||
                            "Not specified"}

                    </span>

                </div>

            </td>


            {/* STATUS */}

            <td className="px-6 py-5">

                <StatusSelect
                    appointment={
                        appointment
                    }
                    updating={
                        isUpdating
                    }
                    onChange={
                        onStatusChange
                    }
                />

            </td>

        </tr>
    );
};


// =====================================================
// MOBILE CARD
// =====================================================

const AppointmentCard = ({
    appointment,
    updatingId,
    onStatusChange
}) => {

    const patient =
        appointment?.userId;

    const doctor =
        appointment?.doctorId;

    const doctorUser =
        doctor?.userId;


    const isUpdating =
        updatingId === appointment?._id;


    return (

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">


            {/* PATIENT + STATUS */}

            <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                    <Avatar
                        user={patient}
                    />

                    <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-900">

                            {patient?.name ||
                                "Unknown Patient"}

                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">

                            {patient?.email ||
                                "No email"}

                        </p>

                    </div>

                </div>


                <StatusBadge
                    status={
                        appointment?.status
                    }
                />

            </div>


            {/* DIVIDER */}

            <div className="my-5 border-t border-slate-100" />


            {/* DOCTOR */}

            <div className="flex items-center gap-3">

                <Avatar
                    user={doctorUser}
                    doctor
                />

                <div>

                    <p className="text-xs text-slate-400">

                        Doctor

                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">

                        Dr.{" "}
                        {doctorUser?.name ||
                            "Unknown Doctor"}

                    </p>

                    <p className="mt-1 text-xs text-emerald-600">

                        {doctor?.speciality ||
                            "Specialist"}

                    </p>

                </div>

            </div>


            {/* APPOINTMENT DETAILS */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <InfoItem
                    icon={CalendarDays}
                    label="Date"
                    value={formatDate(
                        appointment?.date
                    )}
                />

                <InfoItem
                    icon={Clock3}
                    label="Time"
                    value={`${appointment?.startTime || "--"} - ${appointment?.endTime || "--"} `}
                />

                <InfoItem
                    icon={DollarSign}
                    label="Payment"
                    value={
                        appointment?.paymentMethod ||
                        "Not specified"
                    }
                />

                <InfoItem
                    icon={Stethoscope}
                    label="Day"
                    value={
                        appointment?.day ||
                        "Not specified"
                    }
                />

            </div>


            {/* STATUS UPDATE */}

            <div className="mt-5">

                <p className="mb-2 text-xs font-semibold text-slate-500">

                    Update Status

                </p>

                <StatusSelect
                    appointment={
                        appointment
                    }
                    updating={
                        isUpdating
                    }
                    onChange={
                        onStatusChange
                    }
                    fullWidth
                />

            </div>

        </article>
    );
};


// =====================================================
// STATUS SELECT
// =====================================================

const StatusSelect = ({
    appointment,
    updating,
    onChange,
    fullWidth = false
}) => {

    return (

        <div
            className={
                fullWidth
                    ? "w-full"
                    : "relative"
            }
        >

            <select
                value={
                    appointment?.status ||
                    "pending"
                }
                disabled={updating}
                onChange={(event) =>
                    onChange(
                        appointment._id,
                        event.target.value
                    )
                }
                className={`rounded - xl border px - 3 py - 2.5 text - xs font - bold outline - none transition focus: ring - 2 focus: - emerald - 500 / 10 disabled: cursor - not - allowed disabled: opacity - 60 ${fullWidth
                    ? "w-full"
                    : "min-w-32"
                    } ${statusConfig[
                        appointment?.status
                    ]?.className ||
                    "border-slate-200 bg-white text-slate-700"
                    } `}
            >

                <option value="pending">
                    Pending
                </option>

                <option value="confirmed">
                    Confirmed
                </option>

                <option value="completed">
                    Completed
                </option>

                <option value="cancelled">
                    Cancelled
                </option>

            </select>


            {updating && (

                <Loader2
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-emerald-500"
                />

            )}

        </div>
    );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
    status
}) => {

    const config =
        statusConfig[
        status
        ] || {
            label:
                status || "Unknown",
            className:
                "bg-slate-50 text-slate-600 border-slate-200"
        };


    return (

        <span
            className={`shrink - 0 rounded - full border px - 3 py - 1.5 text - [11px] font - bold ${config.className} `}
        >

            {config.label}

        </span>
    );
};


// =====================================================
// AVATAR
// =====================================================

const Avatar = ({
    user,
    doctor = false
}) => {

    return (

        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">

            {user?.image ? (

                <img
                    src={user.image}
                    alt={
                        user?.name ||
                        "User"
                    }
                    className="h-full w-full object-cover"
                />

            ) : (

                doctor ? (
                    <Stethoscope
                        size={18}
                    />
                ) : (
                    user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || (
                        <User
                            size={18}
                        />
                    )
                )

            )}

        </div>
    );
};


// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({
    icon: Icon,
    label,
    value
}) => {

    return (

        <div className="rounded-2xl bg-slate-50 p-3.5">

            <div className="flex items-center gap-2">

                <Icon
                    size={16}
                    className="text-emerald-500"
                />

                <span className="text-[11px] font-medium text-slate-400">

                    {label}

                </span>

            </div>

            <p className="mt-1 text-sm font-semibold capitalize text-slate-700">

                {value}

            </p>

        </div>
    );
};


// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (
    date
) => {

    if (!date) {
        return "Not specified";
    }

    try {

        return new Date(
            date
        ).toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return date;

    }
};


export default AdminAppointments;
