import { Calendar, ShieldCheck, Stethoscope } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative overflow-hidden">

            <div className="absolute -top-32 -left-24 h-96 w-96 bg-cyan-300 rounded-full blur-[140px] opacity-30"></div>

            <div className="absolute bottom-0 right-0 h-112.5 w-112.5 bg-emerald-300 rounded-full blur-[160px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32">

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div>

                        <span className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                            Trusted By 10,000+ Patients
                        </span>

                        <h1 className="text-5xl lg:text-7xl font-black leading-tight mt-8 text-slate-900">
                            Book Your
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-emerald-500">
                                {" "}Doctor
                            </span>

                            <br />

                            In Minutes.
                        </h1>

                        <p className="mt-8 text-lg text-slate-600 leading-8">
                            Find trusted doctors, compare ratings,
                            schedule appointments instantly and manage
                            your healthcare journey with confidence.
                        </p>

                        <div className="flex gap-5 mt-10 flex-wrap">

                            <button className="px-8 py-4 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-xl">
                                Book Appointment
                            </button>

                            <button className="px-8 py-4 rounded-full border border-slate-300">
                                Explore Doctors
                            </button>

                        </div>

                    </div>

                    <div className="relative">

                        <div className="rounded-[40px] bg-linear-to-br from-cyan-100 via-white to-emerald-100 p-10 shadow-2xl">

                            <div className="grid gap-5">

                                <div className="bg-white rounded-3xl p-6 shadow-md flex gap-4 items-center">
                                    <Calendar className="text-cyan-500" />
                                    <div>
                                        <h3 className="font-bold">
                                            Easy Appointment
                                        </h3>
                                        <p className="text-slate-500">
                                            Book within seconds.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 shadow-md flex gap-4 items-center">
                                    <ShieldCheck className="text-emerald-500" />
                                    <div>
                                        <h3 className="font-bold">
                                            Verified Doctors
                                        </h3>
                                        <p className="text-slate-500">
                                            100% trusted professionals.
                                        </p>
                                    </div>
                                </div>


                                <div className="bg-white rounded-3xl p-6 shadow-md flex gap-4 items-center">
                                    <Stethoscope className="text-cyan-500" />
                                    <div>
                                        <h3 className="font-bold">
                                            AI Medical Assistant
                                        </h3>
                                        <p className="text-slate-500">
                                            Get instant health guidance 24/7.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Hero;