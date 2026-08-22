import {
    HeartHandshake,
    Stethoscope,
    ShieldCheck,
    Users,
    Award,
    Clock,
} from "lucide-react";

const About = () => {
    const features = [
        {
            icon: <Stethoscope className="text-cyan-500" size={32} />,
            title: "Expert Doctors",
            desc: "Connect with experienced and verified healthcare professionals for trusted medical care.",
        },
        {
            icon: <ShieldCheck className="text-emerald-500" size={32} />,
            title: "Secure Platform",
            desc: "Your medical records and personal information remain safe and protected.",
        },
        {
            icon: <Clock className="text-cyan-500" size={32} />,
            title: "Quick Appointments",
            desc: "Book appointments in minutes without waiting in long hospital queues.",
        },
        {
            icon: <HeartHandshake className="text-emerald-500" size={32} />,
            title: "Quality Care",
            desc: "We focus on providing the best healthcare experience for every patient.",
        },
    ];

    const stats = [
        {
            number: "10K+",
            title: "Happy Patients",
        },
        {
            number: "500+",
            title: "Verified Doctors",
        },
        {
            number: "24/7",
            title: "Support",
        },
        {
            number: "98%",
            title: "Satisfaction",
        },
    ];

    return (
        <section className="relative overflow-hidden py-20">

            <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan-300 blur-[150px] opacity-30"></div>

            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-[150px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* Hero */}

                <div className="text-center max-w-3xl mx-auto">

                    <span className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        About CareSync AI
                    </span>

                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mt-8">
                        Healthcare Made
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-emerald-500">
                            {" "}Simple
                        </span>
                    </h1>

                    <p className="mt-6 text-slate-600 text-lg leading-8">
                        CareSync AI helps patients connect with trusted doctors,
                        book appointments instantly, and manage their healthcare
                        journey through one smart and secure platform.
                    </p>

                </div>

                {/* Story */}

                <div className="grid lg:grid-cols-2 gap-12 mt-24 items-center">

                    <div className="bg-white rounded-[35px] shadow-xl p-10">

                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Our Story
                        </h2>

                        <p className="text-slate-600 leading-8 mb-5">
                            We believe healthcare should be accessible,
                            affordable, and stress-free. CareSync AI was created
                            to make finding the right doctor and booking
                            appointments easier for everyone.
                        </p>

                        <p className="text-slate-600 leading-8">
                            Our mission is to use modern technology to improve
                            healthcare services and help patients receive the
                            medical care they deserve without unnecessary delays.
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        {stats.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-3xl shadow-lg p-8 text-center"
                            >
                                <h2 className="text-4xl font-black text-emerald-500">
                                    {item.number}
                                </h2>

                                <p className="mt-3 text-slate-600 font-medium">
                                    {item.title}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

                {/* Features */}

                <div className="mt-24">

                    <h2 className="text-4xl font-bold text-center text-slate-900">
                        Why Choose Us
                    </h2>

                    <p className="text-center text-slate-600 mt-4 max-w-2xl mx-auto">
                        We provide a secure and user-friendly healthcare platform
                        designed for both patients and doctors.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

                        {features.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 duration-300"
                            >
                                <div className="mb-5">
                                    {item.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-slate-600 leading-7">
                                    {item.desc}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

                {/* Mission */}

                <div className="mt-24 bg-linear-to-r from-cyan-500 to-emerald-500 rounded-[40px] text-white p-12">

                    <div className="grid lg:grid-cols-2 gap-10 items-center">

                        <div>

                            <h2 className="text-4xl font-bold mb-6">
                                Our Mission
                            </h2>

                            <p className="leading-8 text-white/90">
                                To build a smarter healthcare system where every
                                patient can easily access trusted doctors,
                                receive quality treatment, and manage their
                                medical journey with confidence.
                            </p>

                        </div>

                        <div className="flex justify-center">

                            <div className="bg-white/15 rounded-full p-10">

                                <Users size={90} />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Team */}

                <div className="mt-24">

                    <h2 className="text-4xl font-bold text-center text-slate-900">
                        Meet Our Team
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 mt-14">

                        {[
                            "Dr. Sarah Khan",
                            "Dr. Ahmed Ali",
                            "Dr. Ayesha Noor",
                        ].map((doctor) => (
                            <div
                                key={doctor}
                                className="bg-white rounded-3xl shadow-lg p-8 text-center"
                            >

                                <div className="h-24 w-24 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 mx-auto flex items-center justify-center text-white">

                                    <Award size={40} />

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-slate-900">
                                    {doctor}
                                </h3>

                                <p className="text-slate-500 mt-2">
                                    Senior Healthcare Specialist
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                {/* CTA */}

                <div className="mt-24 text-center bg-white rounded-[40px] shadow-xl p-12">

                    <h2 className="text-4xl font-bold text-slate-900">
                        Your Health Comes First
                    </h2>

                    <p className="mt-5 text-slate-600 max-w-2xl mx-auto leading-8">
                        Join thousands of patients who trust CareSync AI for
                        finding the best doctors and booking appointments with
                        ease.
                    </p>

                    <button className="mt-8 px-8 py-4 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 duration-300">
                        Get Started
                    </button>

                </div>

            </div>

        </section>
    );
};

export default About;