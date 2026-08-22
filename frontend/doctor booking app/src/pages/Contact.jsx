import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
} from "lucide-react";

const Contact = () => {
    return (
        <section className="relative overflow-hidden py-20">

            <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan-300 blur-[150px] opacity-30"></div>

            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-[150px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* Heading */}

                <div className="text-center max-w-3xl mx-auto">

                    <span className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        Contact Us
                    </span>

                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mt-8">
                        We'd Love To
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-emerald-500">
                            {" "}Hear From You
                        </span>
                    </h1>

                    <p className="mt-6 text-slate-600 text-lg leading-8">
                        Have a question, suggestion, or need support?
                        Get in touch with our team anytime.
                    </p>

                </div>

                {/* Content */}

                <div className="grid lg:grid-cols-2 gap-12 mt-20">

                    {/* Contact Info */}

                    <div className="space-y-6">

                        <div className="bg-white rounded-3xl shadow-lg p-6 flex gap-5">

                            <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                                <Phone className="text-cyan-600" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Phone
                                </h3>
                                <p className="text-slate-600 mt-2">
                                    +92 300 1234567
                                </p>
                            </div>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6 flex gap-5">

                            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Mail className="text-emerald-600" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Email
                                </h3>
                                <p className="text-slate-600 mt-2">
                                    support@caresyncai.com
                                </p>
                            </div>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6 flex gap-5">

                            <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                                <MapPin className="text-cyan-600" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Address
                                </h3>
                                <p className="text-slate-600 mt-2">
                                    Lahore, Punjab, Pakistan
                                </p>
                            </div>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6 flex gap-5">

                            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Clock className="text-emerald-600" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Working Hours
                                </h3>
                                <p className="text-slate-600 mt-2">
                                    Monday - Saturday
                                </p>
                                <p className="text-slate-600">
                                    9:00 AM - 8:00 PM
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Contact Form */}

                    <div className="bg-white rounded-[35px] shadow-xl p-8">

                        <h2 className="text-3xl font-bold text-slate-900 mb-8">
                            Send Message
                        </h2>

                        <form className="space-y-5">

                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500"
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500"
                            />

                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500"
                            />

                            <textarea
                                rows="6"
                                placeholder="Write your message..."
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none resize-none focus:border-emerald-500"
                            ></textarea>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:scale-105 duration-300"
                            >
                                <Send size={18} />
                                Send Message
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Contact;