import React, {
    useEffect,
    useState
} from "react";

import {
    User,
    Stethoscope,
    GraduationCap,
    Clock3,
    DollarSign,
    ShieldCheck,
    Upload,
    Plus,
    Trash2,
    Save,
    CalendarDays,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    MapPin,
    Phone,
    Mail,
    FileText,
    BriefcaseMedical,
    Activity,
} from "lucide-react";

import {
    getUser,
    getDoctorProfile,
    updateDoctorProfile,
    uploadDegreeImage
} from "../api/doctor.api";


const CompleteProfile = () => {

    // ================= USER =================

    const [user, setUser] = useState(null);

    // ================= DOCTOR =================

    const [doctor, setDoctor] = useState(null);

    // ================= LOADING =================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [uploadingDegree, setUploadingDegree] =
        useState(false);

    // ================= MESSAGE =================

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // ================= FORM =================

    const [form, setForm] = useState({

        speciality: "",

        experience: "",

        fee: "",

        license: "",

        checkDuration: "",

        isAvailable: false,

        city: "",

        availability: []

    });

    // ================= NEW AVAILABILITY =================

    const [newSlot, setNewSlot] = useState({

        day: "",

        startTime: "",

        endTime: ""

    });

    // ================= DEGREE =================

    const [degreeFile, setDegreeFile] =
        useState(null);

    // =====================================================
    // FETCH DATA
    // =====================================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                setError("");

                const [
                    userResponse,
                    doctorResponse
                ] = await Promise.all([
                    getUser(),
                    getDoctorProfile()
                ]);

                setUser(
                    userResponse?.user || null
                );

                const doctorData =
                    doctorResponse?.doctor;

                setDoctor(
                    doctorData || null
                );

                if (doctorData) {

                    setForm({

                        speciality:
                            doctorData.speciality || "",

                        experience:
                            doctorData.experience ?? "",

                        fee:
                            doctorData.fee ?? "",

                        license:
                            doctorData.license || "",

                        city:
                            doctorData.city || "",

                        checkDuration:
                            doctorData.checkDuration ?? "",

                        isAvailable:
                            doctorData.isAvailable || false,

                        availability:
                            doctorData.availability || []

                    });

                }

            } catch (err) {

                console.error(err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load your profile."
                );

            } finally {

                setLoading(false);

            }

        };

        loadProfile();

    }, []);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // ADD AVAILABILITY
    // =====================================================

    const addAvailability = () => {

        setError("");

        if (!newSlot.day) {

            setError(
                "Please select a day."
            );

            return;

        }

        if (!newSlot.startTime) {

            setError(
                "Please select a start time."
            );

            return;

        }

        if (!newSlot.endTime) {

            setError(
                "Please select an end time."
            );

            return;

        }

        if (
            newSlot.startTime >=
            newSlot.endTime
        ) {

            setError(
                "End time must be after start time."
            );

            return;

        }

        const alreadyExists =
            form.availability.some(
                (slot) =>
                    slot.day === newSlot.day &&
                    slot.startTime === newSlot.startTime &&
                    slot.endTime === newSlot.endTime
            );

        if (alreadyExists) {

            setError(
                "This availability slot already exists."
            );

            return;

        }

        setForm((prev) => ({

            ...prev,

            availability: [
                ...prev.availability,
                {
                    ...newSlot
                }
            ]

        }));

        setNewSlot({

            day: "",

            startTime: "",

            endTime: ""

        });

    };


    // =====================================================
    // REMOVE AVAILABILITY
    // =====================================================

    const removeAvailability = (index) => {

        setForm((prev) => ({

            ...prev,

            availability:
                prev.availability.filter(
                    (_, i) => i !== index
                )

        }));

    };


    // =====================================================
    // DEGREE FILE
    // =====================================================

    const handleDegreeChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Degree image must be less than 5MB."
            );

            return;

        }

        setDegreeFile(file);

        setError("");

    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");

        try {

            setSaving(true);

            // ================= VALIDATION =================

            if (!form.speciality.trim()) {

                setError(
                    "Please enter your speciality."
                );

                return;

            }
            if (!form.city.trim()) {

                setError(
                    "Please enter your city."
                );

                return;

            }

            if (
                form.experience === "" ||
                Number(form.experience) < 0
            ) {

                setError(
                    "Please enter a valid experience."
                );

                return;

            }

            if (
                form.fee === "" ||
                Number(form.fee) <= 0
            ) {

                setError(
                    "Please enter a valid consultation fee."
                );

                return;

            }

            if (!form.license.trim()) {

                setError(
                    "Please enter your medical license."
                );

                return;

            }

            if (
                form.checkDuration === "" ||
                Number(form.checkDuration) <= 0
            ) {

                setError(
                    "Please enter consultation duration."
                );

                return;

            }

            if (
                !form.availability.length
            ) {

                setError(
                    "Please add at least one availability slot."
                );

                return;

            }

            // ================= PROFILE DATA =================

            const doctorData = {

                speciality:
                    form.speciality.trim(),

                experience:
                    Number(form.experience),

                fee:
                    Number(form.fee),

                license:
                    form.license.trim(),

                checkDuration:
                    Number(form.checkDuration),
                city:
                    form.city.trim(),
                isAvailable:
                    form.isAvailable,

                availability:
                    form.availability

            };

            // ================= UPDATE PROFILE =================

            await updateDoctorProfile(
                doctorData
            );

            // ================= DEGREE IMAGE =================

            if (degreeFile) {

                setUploadingDegree(true);

                await uploadDegreeImage(
                    degreeFile
                );

                setDegreeFile(null);

                setUploadingDegree(false);

            }

            // ================= REFRESH PROFILE =================

            const updated =
                await getDoctorProfile();

            setDoctor(
                updated?.doctor || null
            );

            if (updated?.doctor) {

                setForm((prev) => ({

                    ...prev,

                    speciality:
                        updated.doctor.speciality || "",

                    experience:
                        updated.doctor.experience ?? "",

                    fee:
                        updated.doctor.fee ?? "",

                    license:
                        updated.doctor.license || "",
                    city:
                        updated.doctor.city || "",
                    checkDuration:
                        updated.doctor.checkDuration ?? "",

                    isAvailable:
                        updated.doctor.isAvailable || false,

                    availability:
                        updated.doctor.availability || []

                }));

            }

            setMessage(
                "Your doctor profile has been saved successfully."
            );

        } catch (err) {

            console.error(err);

            setUploadingDegree(false);

            setError(
                err?.response?.data?.message ||
                "Unable to save your profile."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        doctor?.approveStatus || "pending";


    // =====================================================
    // LOADING UI
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="flex flex-col items-center gap-4">

                    <Loader2
                        size={40}
                        className="animate-spin text-emerald-500"
                    />

                    <p className="text-slate-500">
                        Loading your profile...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden">

                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-cyan-500/10 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 lg:py-14">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        <div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-4">

                                <Stethoscope
                                    size={17}
                                />

                                Doctor Profile

                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">

                                Complete Your

                                <span className="block text-emerald-600">
                                    Professional Profile
                                </span>

                            </h1>

                            <p className="mt-4 text-slate-500 max-w-2xl leading-relaxed">

                                Add your medical information,
                                consultation details and
                                availability so patients can
                                discover and book appointments
                                with you.

                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm min-w-65">

                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">

                                Approval Status

                            </p>

                            {status === "approved" && (

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">

                                        <CheckCircle2
                                            className="text-emerald-600"
                                        />

                                    </div>

                                    <div>

                                        <p className="font-bold text-emerald-600">
                                            Approved
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Your profile is visible
                                            to patients.
                                        </p>

                                    </div>

                                </div>

                            )}

                            {status === "pending" && (

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center">

                                        <Clock
                                            className="text-amber-600"
                                        />

                                    </div>

                                    <div>

                                        <p className="font-bold text-amber-600">
                                            Pending Review
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Admin approval is required.
                                        </p>

                                    </div>

                                </div>

                            )}

                            {status === "rejected" && (

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center">

                                        <XCircle
                                            className="text-red-600"
                                        />

                                    </div>

                                    <div>

                                        <p className="font-bold text-red-600">
                                            Rejected
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Please update your profile.
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-16">

                {/* ALERTS */}

                {error && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">

                        <XCircle
                            size={20}
                        />

                        <p className="text-sm font-medium">
                            {error}
                        </p>

                    </div>

                )}


                {message && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">

                        <CheckCircle2
                            size={20}
                        />

                        <p className="text-sm font-medium">
                            {message}
                        </p>

                    </div>

                )}


                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">


                    {/* =================================================
                        LEFT PROFILE CARD
                    ================================================= */}

                    <div className="xl:col-span-1">

                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-28">

                            <div className="h-28 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                            <div className="px-6 pb-7">

                                <div className="-mt-14 mb-5">

                                    {user?.image ? (

                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg"
                                        />

                                    ) : (

                                        <div className="w-28 h-28 rounded-3xl bg-linear-to-r from-cyan-500 to-emerald-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold">

                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>

                                    )}

                                </div>


                                <h2 className="text-2xl font-bold text-slate-800">

                                    {user?.name || "Doctor"}

                                </h2>

                                <p className="text-emerald-600 font-medium mt-1">

                                    {form.speciality ||
                                        "Medical Professional"}

                                </p>


                                <div className="mt-6 space-y-4">

                                    <div className="flex items-start gap-3">

                                        <Mail
                                            size={18}
                                            className="text-slate-400 mt-0.5"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Email
                                            </p>

                                            <p className="text-sm font-medium text-slate-700 break-all">
                                                {user?.email || "—"}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-start gap-3">

                                        <Phone
                                            size={18}
                                            className="text-slate-400 mt-0.5"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Phone
                                            </p>

                                            <p className="text-sm font-medium text-slate-700">
                                                {user?.phone || "Not provided"}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-start gap-3">

                                        <MapPin
                                            size={18}
                                            className="text-slate-400 mt-0.5"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Location
                                            </p>

                                            <p className="text-sm font-medium text-slate-700">
                                                {user?.city || "Not provided"}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* AVAILABILITY */}

                                <div className="mt-7 pt-6 border-t border-slate-100">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="font-semibold text-slate-800">
                                                Available for Patients
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">
                                                Show your profile as available
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    isAvailable:
                                                        !prev.isAvailable
                                                }))
                                            }
                                            className={`relative w-14 h-8 rounded-full transition ${form.isAvailable
                                                ? "bg-emerald-500"
                                                : "bg-slate-300"
                                                }`}
                                        >

                                            <span
                                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${form.isAvailable
                                                    ? "left-7"
                                                    : "left-1"
                                                    }`}
                                            />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT FORM
                    ================================================= */}

                    <div className="xl:col-span-2">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >

                            {/* ================= PROFESSIONAL INFO ================= */}

                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                                <div className="flex items-center gap-4 mb-7">

                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

                                        <BriefcaseMedical
                                            className="text-emerald-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-800">
                                            Professional Information
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Your medical credentials and consultation details
                                        </p>

                                    </div>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* SPECIALITY */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            Speciality

                                        </label>

                                        <div className="relative">

                                            <Stethoscope
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                name="speciality"
                                                value={form.speciality}
                                                onChange={handleChange}
                                                placeholder="e.g. Cardiologist"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />

                                        </div>

                                    </div>


                                    {/* EXPERIENCE */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            Experience

                                        </label>

                                        <div className="relative">

                                            <BriefcaseMedical
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="number"
                                                min="0"
                                                name="experience"
                                                value={form.experience}
                                                onChange={handleChange}
                                                placeholder="Years of experience"
                                                className="w-full pl-11 pr-16 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />

                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                                Years
                                            </span>

                                        </div>

                                    </div>


                                    {/* city */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            city

                                        </label>

                                        <div className="relative">

                                            <BriefcaseMedical
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                placeholder="Enter city name"
                                                className="w-full pl-11 pr-16 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />
                                            {/* 
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                                city
                                            </span> */}

                                        </div>

                                    </div>







                                    {/* FEE */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            Consultation Fee

                                        </label>

                                        <div className="relative">

                                            <DollarSign
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="number"
                                                min="1"
                                                name="fee"
                                                value={form.fee}
                                                onChange={handleChange}
                                                placeholder="e.g. 50"
                                                className="w-full pl-11 pr-16 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />

                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                                USD
                                            </span>

                                        </div>

                                    </div>


                                    {/* CHECK DURATION */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            Consultation Duration

                                        </label>

                                        <div className="relative">

                                            <Clock3
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="number"
                                                min="1"
                                                name="checkDuration"
                                                value={form.checkDuration}
                                                onChange={handleChange}
                                                placeholder="e.g. 30"
                                                className="w-full pl-11 pr-16 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />

                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                                Minutes
                                            </span>

                                        </div>

                                    </div>


                                    {/* LICENSE */}

                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                                            Medical License Number

                                        </label>

                                        <div className="relative">

                                            <ShieldCheck
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                name="license"
                                                value={form.license}
                                                onChange={handleChange}
                                                placeholder="Enter your medical license number"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* ================= DEGREE ================= */}

                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                                <div className="flex items-center gap-4 mb-7">

                                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center">

                                        <GraduationCap
                                            className="text-cyan-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-800">
                                            Medical Degree
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Upload your degree or certification document
                                        </p>

                                    </div>

                                </div>


                                <label className="block cursor-pointer">

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDegreeChange}
                                        className="hidden"
                                    />

                                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition">

                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">

                                            <Upload
                                                className="text-emerald-600"
                                            />

                                        </div>

                                        <h3 className="mt-4 font-semibold text-slate-800">

                                            {degreeFile
                                                ? degreeFile.name
                                                : "Upload your degree"}

                                        </h3>

                                        <p className="text-sm text-slate-400 mt-2">

                                            PNG, JPG or JPEG · Maximum 5MB

                                        </p>

                                    </div>

                                </label>


                                {doctor?.degreeImage && !degreeFile && (

                                    <div className="mt-5">

                                        <p className="text-sm font-semibold text-slate-700 mb-3">
                                            Current Degree Document
                                        </p>

                                        <img
                                            src={doctor.degreeImage}
                                            alt="Doctor degree"
                                            className="w-full max-h-80 object-contain rounded-2xl border border-slate-200 bg-slate-50"
                                        />

                                    </div>

                                )}

                            </div>


                            {/* ================= AVAILABILITY ================= */}

                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                                <div className="flex items-center gap-4 mb-7">

                                    <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">

                                        <CalendarDays
                                            className="text-violet-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-800">
                                            Availability
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Add the days and hours when patients can book you
                                        </p>

                                    </div>

                                </div>


                                {/* ADD SLOT */}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                                    {/* DAY */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Day
                                        </label>

                                        <select
                                            value={newSlot.day}
                                            onChange={(e) =>
                                                setNewSlot((prev) => ({
                                                    ...prev,
                                                    day: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        >

                                            <option value="">
                                                Select day
                                            </option>

                                            <option value="Monday">
                                                Monday
                                            </option>

                                            <option value="Tuesday">
                                                Tuesday
                                            </option>

                                            <option value="Wednesday">
                                                Wednesday
                                            </option>

                                            <option value="Thursday">
                                                Thursday
                                            </option>

                                            <option value="Friday">
                                                Friday
                                            </option>

                                            <option value="Saturday">
                                                Saturday
                                            </option>

                                            <option value="Sunday">
                                                Sunday
                                            </option>

                                        </select>

                                    </div>


                                    {/* START */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Start Time
                                        </label>

                                        <input
                                            type="time"
                                            value={newSlot.startTime}
                                            onChange={(e) =>
                                                setNewSlot((prev) => ({
                                                    ...prev,
                                                    startTime: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        />

                                    </div>


                                    {/* END */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            End Time
                                        </label>

                                        <input
                                            type="time"
                                            value={newSlot.endTime}
                                            onChange={(e) =>
                                                setNewSlot((prev) => ({
                                                    ...prev,
                                                    endTime: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        />

                                    </div>


                                    {/* ADD */}

                                    <button
                                        type="button"
                                        onClick={addAvailability}
                                        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                                    >

                                        <Plus
                                            size={18}
                                        />

                                        Add Slot

                                    </button>

                                </div>


                                {/* SLOTS */}

                                <div className="mt-7">

                                    {form.availability.length === 0 ? (

                                        <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl">

                                            <CalendarDays
                                                size={30}
                                                className="mx-auto text-slate-300"
                                            />

                                            <p className="mt-3 text-sm text-slate-500">
                                                No availability added yet.
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="space-y-3">

                                            {form.availability.map(
                                                (slot, index) => (

                                                    <div
                                                        key={index}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                                                    >

                                                        <div className="flex items-center gap-4">

                                                            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center">

                                                                <CalendarDays
                                                                    size={18}
                                                                    className="text-emerald-500"
                                                                />

                                                            </div>

                                                            <div>

                                                                <p className="font-semibold text-slate-800">
                                                                    {slot.day}
                                                                </p>

                                                                <p className="text-sm text-slate-500">
                                                                    {slot.startTime}
                                                                    {" — "}
                                                                    {slot.endTime}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeAvailability(index)
                                                            }
                                                            className="self-end sm:self-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

                                                            Remove

                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* ================= SAVE ================= */}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">

                                <div className="flex items-start gap-3">

                                    <Activity
                                        size={21}
                                        className="text-emerald-500 mt-0.5"
                                    />

                                    <div>

                                        <p className="font-semibold text-slate-800">
                                            Keep your information up to date
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Patients will see your approved professional information.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploadingDegree
                                    }
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >

                                    {saving ||
                                        uploadingDegree ? (

                                        <>

                                            <Loader2
                                                size={19}
                                                className="animate-spin"
                                            />

                                            Saving...

                                        </>

                                    ) : (

                                        <>

                                            <Save
                                                size={19}
                                            />

                                            Save Profile

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>


                        {/* =================================================
                            COMPLETE PROFILE SUMMARY
                        ================================================= */}

                        {doctor && (

                            <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                                <div className="flex items-center gap-4 mb-7">

                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                                        <FileText
                                            className="text-slate-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-800">
                                            Profile Summary
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Your currently saved professional information
                                        </p>

                                    </div>

                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                    <SummaryCard
                                        icon={Stethoscope}
                                        label="Speciality"
                                        value={
                                            doctor.speciality ||
                                            "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={BriefcaseMedical}
                                        label="Experience"
                                        value={
                                            doctor.experience !== undefined
                                                ? `${doctor.experience} years`
                                                : "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={DollarSign}
                                        label="Consultation Fee"
                                        value={
                                            doctor.fee
                                                ? `$${doctor.fee}`
                                                : "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={Clock3}
                                        label="Check Duration"
                                        value={
                                            doctor.checkDuration
                                                ? `${doctor.checkDuration} minutes`
                                                : "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={ShieldCheck}
                                        label="License"
                                        value={
                                            doctor.license ||
                                            "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={ShieldCheck}
                                        label="city"
                                        value={
                                            doctor.city ||
                                            "Not provided"
                                        }
                                    />

                                    <SummaryCard
                                        icon={Activity}
                                        label="Availability"
                                        value={
                                            doctor.isAvailable
                                                ? "Available"
                                                : "Not Available"
                                        }
                                    />

                                </div>


                                {/* SAVED AVAILABILITY */}

                                <div className="mt-7">

                                    <h3 className="font-semibold text-slate-800 mb-4">
                                        Saved Availability
                                    </h3>

                                    <div className="flex flex-wrap gap-3">

                                        {doctor.availability?.length ? (

                                            doctor.availability.map(
                                                (slot, index) => (

                                                    <div
                                                        key={index}
                                                        className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100"
                                                    >

                                                        <p className="text-sm font-semibold text-emerald-700">
                                                            {slot.day}
                                                        </p>

                                                        <p className="text-xs text-emerald-600 mt-1">
                                                            {slot.startTime}
                                                            {" — "}
                                                            {slot.endTime}
                                                        </p>

                                                    </div>

                                                )
                                            )

                                        ) : (

                                            <p className="text-sm text-slate-400">
                                                No availability added.
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>

    );

};


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
    icon: Icon,
    label,
    value
}) => {

    return (

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">

            <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">

                    <Icon
                        size={18}
                        className="text-emerald-500"
                    />

                </div>

                <div className="min-w-0">

                    <p className="text-xs text-slate-400">
                        {label}
                    </p>

                    <p className="font-semibold text-slate-700 truncate">
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );

};


export default CompleteProfile;