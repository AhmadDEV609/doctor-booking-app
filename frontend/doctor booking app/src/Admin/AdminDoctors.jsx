import React, { useEffect, useMemo, useState } from "react";

import {
    Stethoscope,
    Search,
    Mail,
    MapPin,
    Phone,
    Award,
    Clock3,
    CalendarDays,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    ChevronDown,
    UserRound,
} from "lucide-react";

import {
    getAllDoctors,
    updateDoctorStatus,
} from "../api/admin.api";

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllDoctors();

            setDoctors(data.doctors || []);
        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Unable to load doctors."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleStatusChange = async (doctor, status) => {
        const userId = doctor?.userId?._id;

        if (!userId) {
            return;
        }

        try {
            setUpdatingId(doctor._id);

            await updateDoctorStatus(userId, status);

            await fetchDoctors();
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Unable to update doctor status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const name =
                doctor?.userId?.name?.toLowerCase() || "";

            const email =
                doctor?.userId?.email?.toLowerCase() || "";

            const speciality =
                doctor?.speciality?.toLowerCase() || "";

            const license =
                doctor?.license?.toLowerCase() || "";

            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                email.includes(searchValue) ||
                speciality.includes(searchValue) ||
                license.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                doctor.approveStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [doctors, search, statusFilter]);

    const counts = useMemo(() => {
        return {
            total: doctors.length,

            pending: doctors.filter(
                (doctor) =>
                    doctor.approveStatus === "pending"
            ).length,

            approved: doctors.filter(
                (doctor) =>
                    doctor.approveStatus === "approved"
            ).length,

            rejected: doctors.filter(
                (doctor) =>
                    doctor.approveStatus === "rejected"
            ).length,
        };
    }, [doctors]);

    const getStatusStyle = (status) => {
        if (status === "approved") {
            return {
                wrapper:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle2,
            };
        }

        if (status === "rejected") {
            return {
                wrapper:
                    "bg-red-50 text-red-700 border-red-200",
                icon: XCircle,
            };
        }

        return {
            wrapper:
                "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 bg-slate-200 rounded-xl w-72" />

                        <div className="h-5 bg-slate-200 rounded-lg w-96 max-w-full" />

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 bg-white rounded-3xl border border-slate-200"
                                />
                            ))}
                        </div>

                        <div className="h-96 bg-white rounded-3xl border border-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />

                <div className="absolute top-40 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 pb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
                                <Stethoscope size={17} />
                                Doctor Management
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                                Doctors
                            </h1>

                            <p className="mt-2 text-slate-500 max-w-2xl">
                                Review doctor profiles, verify their information
                                and manage approval status from one place.
                            </p>
                        </div>

                        <button
                            onClick={fetchDoctors}
                            className="self-start lg:self-auto inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-emerald-300 hover:text-emerald-600 transition shadow-sm"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Doctors
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                                    {counts.total}
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                <Stethoscope size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Pending
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2">
                                    {counts.pending}
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Approved
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">
                                    {counts.approved}
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Rejected
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">
                                    {counts.rejected}
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <XCircle size={21} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-7">
                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by name, email, speciality or license..."
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition text-sm"
                            />
                        </div>

                        <div className="relative md:w-56">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="appearance-none w-full px-4 py-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition text-sm font-medium text-slate-700"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="approved">
                                    Approved
                                </option>

                                <option value="rejected">
                                    Rejected
                                </option>
                            </select>

                            <ChevronDown
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-6">
                    <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-red-700">
                        {error}
                    </div>
                </div>
            )}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16">
                {filteredDoctors.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                            <UserRound size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mt-5">
                            No doctors found
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Try changing your search or status filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {filteredDoctors.map((doctor) => {
                            const statusStyle =
                                getStatusStyle(doctor.approveStatus);

                            const StatusIcon = statusStyle.icon;

                            const isUpdating =
                                updatingId === doctor._id;

                            return (
                                <article
                                    key={doctor._id}
                                    className="bg-white border border-slate-200 rounded-4xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                            {doctor?.userId?.image ? (
                                                <img
                                                    src={doctor.userId.image}
                                                    alt={doctor.userId.name}
                                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-cyan-500 to-emerald-500 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                                                    {doctor?.userId?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-slate-800">
                                                            Dr.{" "}
                                                            {doctor?.userId?.name ||
                                                                "Unknown Doctor"}
                                                        </h2>

                                                        <p className="text-emerald-600 font-medium mt-1">
                                                            {doctor.speciality ||
                                                                "Speciality not added"}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${statusStyle.wrapper}`}
                                                    >
                                                        <StatusIcon size={14} />
                                                        {doctor.approveStatus}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {doctor?.userId?.bio && (
                                            <div className="mt-5 p-4 rounded-2xl bg-slate-50">
                                                <p className="text-sm text-slate-600 leading-6">
                                                    {doctor.userId.bio}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid sm:grid-cols-2 gap-3 mt-5">
                                            <InfoItem
                                                icon={Award}
                                                label="Experience"
                                                value={
                                                    doctor.experience
                                                        ? `${doctor.experience} years`
                                                        : "Not provided"
                                                }
                                            />

                                            <InfoItem
                                                icon={Clock3}
                                                label="Check Duration"
                                                value={
                                                    doctor.checkDuration
                                                        ? `${doctor.checkDuration} minutes`
                                                        : "Not provided"
                                                }
                                            />

                                            <InfoItem
                                                icon={CalendarDays}
                                                label="Consultation Fee"
                                                value={
                                                    doctor.fee !== undefined
                                                        ? `$${doctor.fee}`
                                                        : "Not provided"
                                                }
                                            />

                                            <InfoItem
                                                icon={FileText}
                                                label="License"
                                                value={
                                                    doctor.license ||
                                                    "Not provided"
                                                }
                                            />
                                        </div>

                                        <div className="mt-5 space-y-2.5">
                                            {doctor?.userId?.email && (
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <Mail
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />

                                                    <span className="truncate">
                                                        {doctor.userId.email}
                                                    </span>
                                                </div>
                                            )}

                                            {doctor?.userId?.phone && (
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <Phone
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />

                                                    <span>
                                                        {doctor.userId.phone}
                                                    </span>
                                                </div>
                                            )}

                                            {doctor?.userId?.city && (
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <MapPin
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />

                                                    <span>
                                                        {doctor.userId.city}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {doctor.availability?.length > 0 && (
                                            <div className="mt-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CalendarDays
                                                        size={17}
                                                        className="text-emerald-500"
                                                    />

                                                    <h3 className="font-semibold text-slate-800">
                                                        Availability
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {doctor.availability.map(
                                                        (slot, index) => (
                                                            <div
                                                                key={index}
                                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                                                            >
                                                                <span className="font-semibold text-slate-700">
                                                                    {slot.day}
                                                                </span>

                                                                <span className="text-slate-400 mx-1">
                                                                    •
                                                                </span>

                                                                <span className="text-slate-500">
                                                                    {slot.startTime}
                                                                    {" - "}
                                                                    {slot.endTime}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {doctor.degreeImage && (
                                            <a
                                                href={doctor.degreeImage}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                            >
                                                <FileText size={17} />
                                                View Degree Document
                                            </a>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Approval Status
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Change the doctor's account status.
                                                </p>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    value={
                                                        doctor.approveStatus ||
                                                        "pending"
                                                    }
                                                    disabled={isUpdating}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            doctor,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="appearance-none min-w-44 px-4 py-3 pr-10 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:opacity-60 cursor-pointer"
                                                >
                                                    <option value="pending">
                                                        Pending
                                                    </option>

                                                    <option value="approved">
                                                        Approved
                                                    </option>

                                                    <option value="rejected">
                                                        Rejected
                                                    </option>
                                                </select>

                                                {isUpdating ? (
                                                    <RefreshCw
                                                        size={17}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin pointer-events-none"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={17}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                <Icon size={17} />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-slate-400">
                    {label}
                </p>

                <p className="text-sm font-semibold text-slate-700 truncate">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default AdminDoctors;
