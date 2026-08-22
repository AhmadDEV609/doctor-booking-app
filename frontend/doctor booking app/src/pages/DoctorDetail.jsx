import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ArrowLeft,
    Award,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    FileText,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Stethoscope
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    createAppointment,
    getDoctorById
} from "../api/doctor.api";
import { paymentApi } from "../api/payment.api";

const DoctorDetail = () => {

    const { doctorId } = useParams();

    const navigate = useNavigate();



    const [doctor, setDoctor] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedDate, setSelectedDate] = useState("");

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [booking, setBooking] = useState(false);

    const [bookingError, setBookingError] = useState("");

    const [success, setSuccess] = useState(false);


    // =====================================================
    // GET DOCTOR
    // =====================================================

    useEffect(() => {

        const fetchDoctor = async () => {

            try {

                setLoading(true);

                const data = await getDoctorById(doctorId);

                setDoctor(data?.doctor || null);

            } catch (error) {

                console.error(error);

                setError(
                    error?.response?.data?.message ||
                    "Unable to load doctor."
                );

            } finally {

                setLoading(false);

            }

        };


        if (doctorId) {
            fetchDoctor();
        }

    }, [doctorId]);



    const selectedDay = useMemo(() => {

        if (!selectedDate) {
            return "";
        }




        const [year, month, day] =
            selectedDate.split("-").map(Number);


        const date = new Date(
            year,
            month - 1,
            day
        );


        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

    }, [selectedDate]);




    const dayAvailability = useMemo(() => {

        if (!doctor || !selectedDay) {
            return [];
        }


        return doctor.availability?.filter((item) => item.day.toLowerCase() === selectedDay.toLowerCase()) || [];

    }, [doctor, selectedDay]);




    const availableSlots = useMemo(() => {

        if (!doctor || dayAvailability.length === 0) {
            return [];
        }


        const duration = Number(doctor.checkDuration) || 30;


        const slots = [];


        dayAvailability.forEach((availability) => {

            const start = convertTimeToMinutes(
                availability.startTime
            );

            const end = convertTimeToMinutes(
                availability.endTime
            );


            let current = start;


            while (current + duration <= end) {

                const slotStart =
                    convertMinutesToTime(current);

                const slotEnd =
                    convertMinutesToTime(
                        current + duration
                    );


                slots.push({
                    startTime: slotStart,
                    endTime: slotEnd
                });


                current += duration;

            }

        });


        return slots;

    }, [
        doctor,
        dayAvailability
    ]);




    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const minDate =
        `${year}-${month}-${day}`;



    const handleDateChange = (event) => {

        const date = event.target.value;

        setSelectedDate(date);

        setSelectedSlot(null);

        setBookingError("");

    };




    const handleBooking = async () => {

        if (!selectedDate) {

            setBookingError(
                "Please select a date."
            );

            return;
        }


        if (!selectedSlot) {

            setBookingError(
                "Please select a time slot."
            );

            return;
        }


        if (!paymentMethod) {

            setBookingError(
                "Please select payment method."
            );

            return;
        }


        try {

            setBooking(true);

            setBookingError("");

            if (paymentMethod === "cash") {
                const data = await createAppointment(
                    doctor._id,
                    {
                        date: selectedDate,

                        startTime:
                            selectedSlot.startTime,

                        endTime:
                            selectedSlot.endTime,

                        paymentMethod
                    }
                );


                console.log(
                    "Appointment created:",
                    data
                );


                setSuccess(true);

            }
            if (paymentMethod === "online") {
                const data = await paymentApi({
                    doctorId: doctor._id,
                    date: selectedDate,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime
                })
                if (data?.url) {
                    window.location.href = data.url;
                }
            }





        } catch (error) {

            console.error(error);

            setBookingError(
                error?.response?.data?.message ||
                "Unable to book appointment."
            );

        } finally {

            setBooking(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-5 py-12">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-40 rounded-xl bg-slate-200" />

                        <div className="grid gap-6 lg:grid-cols-3">

                            <div className="h-125 rounded-3xl bg-white lg:col-span-2" />

                            <div className="h-125 rounded-3xl bg-white" />

                        </div>

                    </div>

                </div>

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !doctor) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                        <Stethoscope size={28} />

                    </div>


                    <h2 className="mt-5 text-xl font-bold text-slate-800">
                        Doctor not found
                    </h2>


                    <p className="mt-2 text-slate-500">
                        {error ||
                            "Doctor profile could not be found."}
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="mt-6 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white"
                    >
                        Back to Doctors
                    </button>

                </div>

            </div>

        );

    }


    const user = doctor.userId;


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* HEADER */}

            <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-cyan-50">

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600"
                    >

                        <ArrowLeft size={18} />

                        Back to Doctors

                    </button>

                </div>

            </section>


            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

                <div className="grid gap-7 lg:grid-cols-3">




                    <div className="space-y-7 lg:col-span-2">


                        {/* PROFILE */}

                        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            <div className="h-28 bg-linear-to-r from-emerald-500 to-cyan-500" />


                            <div className="px-6 pb-8 sm:px-8">

                                <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">


                                    {/* IMAGE */}

                                    {user?.image ? (

                                        <img
                                            src={user.image}
                                            alt={user?.name || "Doctor"}
                                            className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg"
                                        />

                                    ) : (

                                        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-linear-to-br from-cyan-500 to-emerald-500 text-4xl font-bold text-white shadow-lg">

                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "D"}

                                        </div>

                                    )}


                                    {/* NAME */}

                                    <div className="flex-1 pb-1">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">

                                                Dr.{" "}

                                                {user?.name || "Doctor"}

                                            </h1>


                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">

                                                <ShieldCheck size={14} />

                                                Verified

                                            </span>

                                        </div>


                                        <p className="mt-1 font-semibold text-emerald-600">

                                            {doctor.speciality ||
                                                "Healthcare Specialist"}

                                        </p>

                                    </div>

                                </div>


                                {/* BIO */}

                                <div className="mt-7">

                                    <h2 className="text-lg font-bold text-slate-900">
                                        About Doctor
                                    </h2>

                                    <p className="mt-3 leading-7 text-slate-600">

                                        {user?.bio ||
                                            "This doctor has not added a biography yet."}

                                    </p>

                                </div>


                                {/* STATS */}

                                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                    <DetailBox
                                        icon={Award}
                                        label="Experience"
                                        value={`${doctor.experience || 0} Years`}
                                    />

                                    <DetailBox
                                        icon={Clock3}
                                        label="Consultation"
                                        value={`${doctor.checkDuration || 30} Min`}
                                    />

                                    <DetailBox
                                        icon={DollarSign}
                                        label="Fee"
                                        value={`$${doctor.fee || 0} `}
                                    />

                                    <DetailBox
                                        icon={CheckCircle2}
                                        label="Status"
                                        value="Approved"
                                    />

                                </div>

                            </div>

                        </section>


                        {/* CONTACT */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                    <FileText size={19} />

                                </div>


                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Contact Information
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Doctor's professional contact details
                                    </p>

                                </div>

                            </div>


                            <div className="grid gap-4 sm:grid-cols-2">

                                <ContactItem
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        user?.email ||
                                        "Not provided"
                                    }
                                />

                                <ContactItem
                                    icon={Phone}
                                    label="Phone"
                                    value={
                                        user?.phone ||
                                        "Not provided"
                                    }
                                />

                                <ContactItem
                                    icon={MapPin}
                                    label="City"
                                    value={
                                        doctor?.city ||
                                        "Not provided"
                                    }
                                />

                                <ContactItem
                                    icon={FileText}
                                    label="License"
                                    value={
                                        doctor.license ||
                                        "Not provided"
                                    }
                                />

                            </div>

                        </section>



                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">


                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">

                                    <CalendarDays size={19} />

                                </div>


                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Book Appointment
                                    </h2>

                                    <p className="text-sm text-slate-500">

                                        Select a date and choose an available time slot.

                                    </p>

                                </div>

                            </div>


                            {/* DOCTOR WORKING HOURS */}

                            <div className="mt-6">

                                <p className="mb-3 text-sm font-semibold text-slate-700">

                                    Doctor Availability

                                </p>


                                <div className="space-y-3">

                                    {doctor.availability?.length > 0 ? (

                                        doctor.availability.map(
                                            (item, index) => (

                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <CalendarDays
                                                            size={18}
                                                            className="text-emerald-500"
                                                        />

                                                        <span className="font-semibold text-slate-800">

                                                            {item.day}

                                                        </span>

                                                    </div>


                                                    <span className="text-sm text-slate-500">

                                                        {item.startTime}
                                                        {" - "}
                                                        {item.endTime}

                                                    </span>

                                                </div>

                                            )
                                        )

                                    ) : (

                                        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">

                                            Doctor has not added availability.

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* DATE */}

                            {doctor.availability?.length > 0 && (

                                <div className="mt-7">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                                        Select Appointment Date

                                    </label>


                                    <input
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />


                                    {/* SELECTED DAY */}

                                    {selectedDate && (

                                        <p className="mt-3 text-sm text-slate-500">

                                            Selected Day:

                                            <span className="ml-1 font-bold text-emerald-600">

                                                {selectedDay}

                                            </span>

                                        </p>

                                    )}

                                </div>

                            )}


                            {/* SLOTS */}

                            {selectedDate && (

                                <div className="mt-7">


                                    <div className="mb-3 flex items-center justify-between">

                                        <p className="text-sm font-semibold text-slate-700">

                                            Available Time Slots

                                        </p>


                                        <span className="text-xs text-slate-400">

                                            {doctor.checkDuration || 30} minutes

                                        </span>

                                    </div>


                                    {availableSlots.length > 0 ? (

                                        <div className="grid gap-3 sm:grid-cols-2">


                                            {availableSlots.map(
                                                (slot, index) => {

                                                    const active =
                                                        selectedSlot?.startTime ===
                                                        slot.startTime &&
                                                        selectedSlot?.endTime ===
                                                        slot.endTime;


                                                    return (

                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedSlot(slot)
                                                            }
                                                            className={`rounded - 2xl border p - 4 text - left transition ${active
                                                                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                                                                : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
                                                                } `}
                                                        >

                                                            <div className="flex items-center justify-between">


                                                                <div className="flex items-center gap-2">

                                                                    <Clock3
                                                                        size={17}
                                                                        className="text-emerald-500"
                                                                    />

                                                                    <span className="font-semibold text-slate-800">

                                                                        {slot.startTime}
                                                                        {" - "}
                                                                        {slot.endTime}

                                                                    </span>

                                                                </div>


                                                                {active && (

                                                                    <CheckCircle2
                                                                        size={18}
                                                                        className="text-emerald-500"
                                                                    />

                                                                )}

                                                            </div>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    ) : (

                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">

                                            Doctor is not available on{" "}

                                            <span className="font-semibold">

                                                {selectedDay}

                                            </span>

                                        </div>

                                    )}

                                </div>

                            )}

                        </section>

                    </div>



                    <aside className="h-fit lg:sticky lg:top-6">

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            <div className="p-6 sm:p-7">


                                <p className="text-sm font-semibold text-emerald-600">
                                    Book Consultation
                                </p>


                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Schedule an appointment
                                </h2>


                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    Select your preferred date and time.

                                </p>


                                {/* SELECTED APPOINTMENT */}

                                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">


                                    <div className="flex items-center gap-3">

                                        <CalendarDays
                                            size={18}
                                            className="text-emerald-500"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Date
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700">

                                                {selectedDate ||
                                                    "Select a date"}

                                            </p>

                                        </div>

                                    </div>


                                    <div className="mt-4 flex items-center gap-3">

                                        <Clock3
                                            size={18}
                                            className="text-cyan-500"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Time
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700">

                                                {selectedSlot

                                                    ? `${selectedSlot.startTime} - ${selectedSlot.endTime} `

                                                    : "Select a time"

                                                }

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* PAYMENT */}

                                <div className="mt-6">

                                    <p className="mb-3 text-sm font-semibold text-slate-700">
                                        Payment Method
                                    </p>


                                    <div className="space-y-3">


                                        {/* CASH */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("cash")
                                            }
                                            className={`w - full rounded - 2xl border p - 4 text - left transition ${paymentMethod === "cash"
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-slate-200 hover:border-emerald-300"
                                                } `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                                                    <DollarSign size={19} />

                                                </div>


                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        Cash on Place
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Pay at the clinic
                                                    </p>

                                                </div>


                                                {paymentMethod === "cash" && (

                                                    <CheckCircle2
                                                        size={18}
                                                        className="ml-auto text-emerald-500"
                                                    />

                                                )}

                                            </div>

                                        </button>


                                        {/* ONLINE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("online")
                                            }
                                            className={`w - full rounded - 2xl border p - 4 text - left transition ${paymentMethod === "online"
                                                ? "border-cyan-500 bg-cyan-50"
                                                : "border-slate-200 hover:border-cyan-300"
                                                } `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">

                                                    <ShieldCheck size={19} />

                                                </div>


                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        Online Payment
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Secure online checkout
                                                    </p>

                                                </div>


                                                {paymentMethod === "online" && (

                                                    <CheckCircle2
                                                        size={18}
                                                        className="ml-auto text-cyan-500"
                                                    />

                                                )}

                                            </div>

                                        </button>

                                    </div>

                                </div>


                                {/* FEE */}

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                                    <span className="text-sm text-slate-500">
                                        Consultation Fee
                                    </span>


                                    <span className="text-2xl font-bold text-slate-900">

                                        ${doctor.fee || 0}

                                    </span>

                                </div>


                                {/* ERROR */}

                                {bookingError && (

                                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">

                                        {bookingError}

                                    </div>

                                )}


                                {/* BOOK */}

                                <button
                                    type="button"
                                    onClick={handleBooking}
                                    disabled={booking}
                                    className="mt-6 w-full rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {booking
                                        ? "Booking..."
                                        : "Book Appointment"}

                                </button>


                                {/* CHAT */}



                                <p className="mt-4 text-center text-xs text-slate-400">

                                    Your appointment information is handled securely.

                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>




            {success && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">


                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                            <CheckCircle2 size={32} />

                        </div>


                        <h2 className="mt-5 text-2xl font-bold text-slate-900">

                            Appointment Booked

                        </h2>


                        <p className="mt-3 leading-6 text-slate-500">

                            Your appointment with Dr.{" "}

                            {user?.name}

                            {" "}has been successfully created.

                        </p>


                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">

                            <p className="text-sm text-slate-500">
                                Date
                            </p>

                            <p className="font-semibold text-slate-800">
                                {selectedDate}
                            </p>


                            <p className="mt-3 text-sm text-slate-500">
                                Time
                            </p>

                            <p className="font-semibold text-slate-800">

                                {selectedSlot?.startTime}
                                {" - "}
                                {selectedSlot?.endTime}

                            </p>


                            <p className="mt-3 text-sm text-slate-500">
                                Payment
                            </p>

                            <p className="font-semibold capitalize text-slate-800">

                                {paymentMethod}

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/appointments")
                            }
                            className="mt-6 w-full rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-3.5 font-bold text-white"
                        >

                            View My Appointments

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};



const convertTimeToMinutes = (time) => {

    if (!time) {
        return 0;
    }


    const [hours, minutes] =
        time.split(":").map(Number);


    return (
        hours * 60 +
        minutes
    );

};




const convertMinutesToTime = (minutes) => {

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(mins).padStart(2, "0")
    );

};




const DetailBox = ({
    icon: Icon,
    label,
    value
}) => {

    return (

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                <Icon size={17} />

            </div>


            <p className="mt-3 text-xs text-slate-400">
                {label}
            </p>


            <p className="mt-1 text-sm font-bold text-slate-800">

                {value}

            </p>

        </div>

    );

};



const ContactItem = ({
    icon: Icon,
    label,
    value
}) => {

    return (

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                <Icon size={17} />

            </div>


            <div className="min-w-0">

                <p className="text-xs text-slate-400">
                    {label}
                </p>


                <p className="truncate text-sm font-semibold text-slate-700">

                    {value}

                </p>

            </div>

        </div>

    );

};


export default DoctorDetail;

