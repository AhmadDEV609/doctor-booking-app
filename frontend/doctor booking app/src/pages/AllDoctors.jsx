import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Search,
    Star,
    Stethoscope,
    UserRound,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getDoctors } from "../api/doctor.api";


const AllDoctors = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [selectedSpeciality, setSelectedSpeciality] = useState("");


    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalDoctor: 0,
        totalPages: 1,
        limit: 6,
    });


    // =====================================================
    // SPECIALITIES
    // =====================================================

    const specialities = [
        "All",
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Pediatrician",
        "Psychiatrist",
        "Dentist",
        "General Physician",
    ];


    // =====================================================
    // FETCH DOCTORS
    // =====================================================

    const fetchDoctors = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getDoctors(
                page,
                selectedSpeciality
            );

            setDoctors(data?.doctors || []);

            setPagination(
                data?.pagination || {
                    currentPage: 1,
                    totalDoctor: 0,
                    totalPages: 1,
                    limit: 6,
                }
            );

        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Unable to load doctors. Please try again."
            );

            setDoctors([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDoctors();

    }, [page, selectedSpeciality]);


    // =====================================================
    // SPECIALITY FILTER
    // =====================================================

    const handleSpeciality = (speciality) => {

        if (speciality === "All") {
            setSelectedSpeciality("");
        } else {
            setSelectedSpeciality(speciality);
        }

        setPage(1);

    };



    const handleViewProfile = (doctor) => {
        console.log("Doctor ID:", doctor._id);

        const url = `/doctor/detail/${doctor._id}`;

        console.log("Navigating to:", url);

        navigate(url);

    };



    const handlePrevious = () => {

        if (page > 1) {

            setPage((previous) => previous - 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        }

    };


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const handleNext = () => {

        if (page < pagination.totalPages) {

            setPage((previous) => previous + 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        }

    };


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const pageNumbers = useMemo(() => {

        const pages = [];

        for (
            let i = 1;
            i <= pagination.totalPages;
            i++
        ) {

            pages.push(i);

        }

        return pages;

    }, [pagination.totalPages]);


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-cyan-50">

                {/* Decorative circles */}

                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />


                <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

                    <div className="mx-auto max-w-3xl text-center">

                        {/* Badge */}

                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm">

                            <Stethoscope size={17} />

                            Find Your Doctor

                        </div>


                        {/* Heading */}

                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">

                            Find the right{" "}

                            <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">

                                doctor

                            </span>{" "}

                            for you

                        </h1>


                        {/* Description */}

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">

                            Connect with verified healthcare professionals
                            and find the right specialist for your needs.

                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">

                            Our Doctors

                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">

                            Meet our specialists

                        </h2>

                        <p className="mt-2 text-slate-500">

                            Choose a specialist according to your needs.

                        </p>

                    </div>


                    {!loading && (

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                            <UserRound size={17} />

                            {pagination.totalDoctor} doctors available

                        </div>

                    )}

                </div>


                {/* =================================================
                    SPECIALITY FILTER
                ================================================= */}

                <div className="mb-10">

                    <div className="mb-4 flex items-center gap-2">

                        <Search
                            size={18}
                            className="text-emerald-500"
                        />

                        <h3 className="font-semibold text-slate-800">

                            Filter by speciality

                        </h3>

                    </div>


                    <div className="flex gap-3 overflow-x-auto pb-3">

                        {specialities.map((speciality) => {

                            const active =
                                speciality === "All"
                                    ? selectedSpeciality === ""
                                    : selectedSpeciality === speciality;


                            return (

                                <button
                                    key={speciality}
                                    type="button"
                                    onClick={() =>
                                        handleSpeciality(speciality)
                                    }
                                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${active
                                        ? "border-transparent bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-100"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                                        }`}
                                >

                                    {speciality}

                                </button>

                            );

                        })}

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3, 4, 5, 6].map((item) => (

                            <div
                                key={item}
                                className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                            >

                                <div className="flex gap-4">

                                    <div className="h-20 w-20 rounded-2xl bg-slate-200" />

                                    <div className="flex-1">

                                        <div className="mb-3 h-4 w-32 rounded bg-slate-200" />

                                        <div className="h-3 w-24 rounded bg-slate-200" />

                                    </div>

                                </div>


                                <div className="mt-6 h-3 w-full rounded bg-slate-200" />

                                <div className="mt-3 h-3 w-4/5 rounded bg-slate-200" />

                                <div className="mt-6 h-11 w-full rounded-xl bg-slate-200" />

                            </div>

                        ))}

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                            <Stethoscope size={25} />

                        </div>


                        <h3 className="mt-5 text-xl font-bold text-slate-800">

                            Something went wrong

                        </h3>


                        <p className="mt-2 text-slate-500">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={fetchDoctors}
                            className="mt-6 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                        >

                            Try Again

                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    doctors.length === 0 && (

                        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">

                                <Stethoscope size={28} />

                            </div>


                            <h3 className="mt-5 text-xl font-bold text-slate-800">

                                No doctors found

                            </h3>


                            <p className="mt-2 text-slate-500">

                                There are no approved doctors for this speciality.

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    handleSpeciality("All")
                                }
                                className="mt-6 rounded-xl border border-emerald-200 px-6 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
                            >

                                View all doctors

                            </button>

                        </div>

                    )}


                {/* =================================================
                    DOCTORS
                ================================================= */}

                {!loading &&
                    !error &&
                    doctors.length > 0 && (

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {doctors.map((doctor) => {

                                const user = doctor.userId;


                                return (

                                    <article
                                        key={doctor._id}
                                        className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        <div className="p-6">


                                            {/* =================================================
                                                IMAGE + VERIFIED
                                            ================================================= */}

                                            <div className="flex items-start justify-between gap-4">

                                                {user?.image ? (

                                                    <img
                                                        src={user.image}
                                                        alt={user.name || "Doctor"}
                                                        className="h-20 w-20 rounded-2xl border border-slate-100 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-emerald-500 text-2xl font-bold uppercase text-white">

                                                        {user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "D"}

                                                    </div>

                                                )}


                                                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">

                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                    Verified

                                                </div>

                                            </div>


                                            {/* =================================================
                                                NAME + SPECIALITY
                                            ================================================= */}

                                            <div className="mt-5">

                                                <h3 className="text-xl font-bold text-slate-900">

                                                    Dr. {user?.name || "Doctor"}

                                                </h3>


                                                <p className="mt-1 font-medium text-emerald-600">

                                                    {doctor.speciality ||
                                                        "Healthcare Specialist"}

                                                </p>

                                            </div>


                                            {/* =================================================
                                                BIO
                                            ================================================= */}

                                            <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-6 text-slate-500">

                                                {user?.bio ||
                                                    "Experienced healthcare professional dedicated to providing quality and compassionate care."}

                                            </p>


                                            {/* =================================================
                                                DETAILS
                                            ================================================= */}

                                            <div className="mt-5 space-y-3">

                                                {user?.city && (

                                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                                        <MapPin
                                                            size={17}
                                                            className="shrink-0 text-emerald-500"
                                                        />

                                                        <span>
                                                            {user.city}
                                                        </span>

                                                    </div>

                                                )}


                                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                                    <Clock3
                                                        size={17}
                                                        className="shrink-0 text-cyan-500"
                                                    />

                                                    <span>
                                                        {doctor.experience || 0}
                                                        {" "}years experience
                                                    </span>

                                                </div>


                                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                                    <CalendarDays
                                                        size={17}
                                                        className="shrink-0 text-emerald-500"
                                                    />

                                                    <span>
                                                        {doctor.checkDuration || 30}
                                                        {" "}min consultation
                                                    </span>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                FEE + RATING
                                            ================================================= */}

                                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                                                <div>

                                                    <p className="text-xs text-slate-400">

                                                        Consultation Fee

                                                    </p>


                                                    <p className="text-xl font-bold text-slate-900">

                                                        ${doctor.fee || 0}

                                                    </p>

                                                </div>



                                            </div>


                                            {/* =================================================
                                                VIEW PROFILE
                                            ================================================= */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewProfile(doctor)
                                                }
                                                className="mt-6 w-full rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                                            >

                                                View Profile

                                            </button>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    !error &&
                    doctors.length > 0 &&
                    pagination.totalPages > 1 && (

                        <div className="mt-12 flex flex-col items-center justify-between gap-5 sm:flex-row">


                            <p className="text-sm text-slate-500">

                                Page{" "}

                                <span className="font-semibold text-slate-800">

                                    {pagination.currentPage}

                                </span>

                                {" "}of{" "}

                                <span className="font-semibold text-slate-800">

                                    {pagination.totalPages}

                                </span>

                            </p>


                            <div className="flex items-center gap-2">

                                {/* Previous */}

                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft size={19} />

                                </button>


                                {/* Pages */}

                                {pageNumbers.map((number) => (

                                    <button
                                        type="button"
                                        key={number}
                                        onClick={() => {

                                            setPage(number);

                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });

                                        }}
                                        className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${page === number
                                            ? "bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                                            }`}
                                    >

                                        {number}

                                    </button>

                                ))}




                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                        page === pagination.totalPages
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronRight size={19} />

                                </button>

                            </div>

                        </div>

                    )}

            </section>





            <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">

                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 to-cyan-500 p-8 text-white md:p-12">


                    {/* Decorative circles */}

                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

                    <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10" />


                    <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                        <div className="max-w-2xl">

                            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">

                                CareSync AI

                            </p>


                            <h2 className="mt-2 text-2xl font-bold md:text-3xl">

                                Your health deserves the right care.

                            </h2>


                            <p className="mt-3 text-white/80">

                                Find a trusted healthcare professional and
                                take the next step toward better health.

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => handleSpeciality("All")}
                            className="shrink-0 rounded-xl bg-white px-7 py-3.5 font-bold text-emerald-600 shadow-lg transition hover:bg-slate-50"
                        >

                            Explore Doctors

                        </button>

                    </div>

                </div>

            </section>

        </div>

    );

};


export default AllDoctors;