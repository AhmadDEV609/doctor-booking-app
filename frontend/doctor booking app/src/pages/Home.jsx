import React from 'react'
import Hero from '../components/Hero'

import Features from '../components/Features'
import CTA from '../components/CTA'
import Stats from '../components/Stats'

const Home = () => {
    return (
        <div className="bg-slate-50 min-h-screen">

            <Hero />
            <Stats />
            <Features />
            <CTA />

        </div>
    )
}

export default Home