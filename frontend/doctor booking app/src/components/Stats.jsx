const stats = [
    {
        number: "500+",
        title: "Expert Doctors",
    },
    {
        number: "25K+",
        title: "Patients",
    },
    {
        number: "150+",
        title: "Hospitals",
    },
    {
        number: "99%",
        title: "Success Rate",
    },
];

const Stats = () => {
    return (
        <section className="py-14">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-3xl p-10 shadow-lg text-center"
                        >
                            <h2 className="text-4xl font-black text-cyan-600">
                                {item.number}
                            </h2>

                            <p className="mt-3 text-slate-600">
                                {item.title}
                            </p>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default Stats;