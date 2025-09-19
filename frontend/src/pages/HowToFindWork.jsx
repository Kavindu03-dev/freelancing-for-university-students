import React from 'react';
import { Link } from 'react-router-dom';

function HowToFindWork() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer to avoid fixed header overlap */}
      <div className="pt-20 sm:pt-24" />

      <section className="bg-gradient-to-r from-yellow-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 scroll-mt-32">How to Find Work as a Freelancer</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">A friendly step-by-step guide to attract clients, win jobs and grow your reputation.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/join" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition">Create Your Profile</Link>
            <Link to="/services" className="inline-block bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:shadow-md transition">Browse Jobs</Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Polish your profile', body: 'Complete your profile with a clear headline, professional photo, portfolio items and a short, compelling bio.' },
            { title: 'Choose the right gigs', body: 'Select projects that match your strengths and price competitively while demonstrating value to clients.' },
            { title: 'Write winning proposals', body: 'Keep proposals short, explain how you’ll solve the client’s problem, show relevant work and propose clear next steps.' },
            { title: 'Deliver quality work quickly', body: 'Underpromise and overdeliver: meet deadlines, communicate proactively and send polished deliverables.' },
            { title: 'Ask for reviews and referrals', body: 'Positive reviews build trust. Ask satisfied clients for a review and offer referral incentives where appropriate.' },
            { title: 'Keep learning and iterating', body: 'Improve your skills, refine your portfolio, and test different pricing/offerings to find what converts best.' }
          ].map((step, idx) => (
            <article key={idx} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black">{idx + 1}</div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="mt-3 text-gray-600">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/join" className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:brightness-95 transition">Start Your Profile</Link>
        </div>
      </main>
    </div>
  );
}

export default HowToFindWork;
