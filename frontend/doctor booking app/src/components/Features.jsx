import {
    HeartPulse,
    Clock3,
    Shield,
} from "lucide-react";

const features = [
    {
        icon: HeartPulse,
        title: "Best Specialists",
        desc: "Highly experienced healthcare professionals."
    },
    {
        icon: Clock3,
        title: "24/7 Booking",
        desc: "Schedule appointments anytime."
    },
    {
        icon: Shield,
        title: "Secure Data",
        desc: "Privacy and security guaranteed."
    },
];

const Features = () => {
    return (
        <section className="py-24">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-black text-center">
                    Why Choose Us
                </h2>

                <div className="grid lg:grid-cols-3 gap-8 mt-16">

                    {features.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl bg-white shadow-xl p-10 hover:-translate-y-2 duration-300"
                        >

                            <item.icon
                                className="text-cyan-500"
                                size={45}
                            />

                            <h3 className="font-bold text-2xl mt-6">
                                {item.title}
                            </h3>

                            <p className="mt-4 text-slate-500 leading-8">
                                {item.desc}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
};

export default Features;