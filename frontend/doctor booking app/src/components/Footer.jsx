import { Mail, Phone, MapPin } from "lucide-react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Logo & Description */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-linear-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-xl font-bold">
                                D
                            </div>

                            <div>
                                <h2 className="font-bold text-2xl">
                                    DoctorBook
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Smart Healthcare
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 text-slate-400 leading-7">
                            Connect with trusted doctors, book appointments instantly,
                            and get AI-powered healthcare assistance anytime.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-4 text-slate-400">
                            <li className="hover:text-cyan-400 transition cursor-pointer">
                                Home
                            </li>

                            <li className="hover:text-cyan-400 transition cursor-pointer">
                                All Doctors
                            </li>

                            <li className="hover:text-cyan-400 transition cursor-pointer">
                                About
                            </li>

                            <li className="hover:text-cyan-400 transition cursor-pointer">
                                Contact
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Services
                        </h3>

                        <ul className="space-y-4 text-slate-400">
                            <li>Doctor Appointment</li>
                            <li>AI Medical Assistant</li>
                            <li>Verified Specialists</li>
                            <li>Online Consultation</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Contact Us
                        </h3>

                        <div className="space-y-5">

                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone className="text-cyan-400" size={18} />
                                <span>+92 300 1234567</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail className="text-cyan-400" size={18} />
                                <span>support@doctorbook.com</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400">
                                <MapPin className="text-cyan-400" size={18} />
                                <span>Lahore, Pakistan</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-700 my-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <p className="text-slate-400 text-center">
                        © {new Date().getFullYear()} DoctorBook. All rights reserved.
                    </p>

                    <div className="flex gap-4">

                        <button className="h-11 w-11 rounded-full bg-slate-800 hover:bg-cyan-500 transition flex items-center justify-center">
                            <FaFacebookF />
                        </button>

                        <button className="h-11 w-11 rounded-full bg-slate-800 hover:bg-cyan-500 transition flex items-center justify-center">
                            <FaInstagram />
                        </button>

                        <button className="h-11 w-11 rounded-full bg-slate-800 hover:bg-cyan-500 transition flex items-center justify-center">
                            <FaXTwitter />
                        </button>

                        <button className="h-11 w-11 rounded-full bg-slate-800 hover:bg-cyan-500 transition flex items-center justify-center">
                            <FaLinkedinIn />
                        </button>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;