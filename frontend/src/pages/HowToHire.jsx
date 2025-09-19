import React from 'react';
import { Link } from 'react-router-dom';

function HowToHire() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer to avoid fixed header overlap */}
      <div className="pt-20 sm:pt-24" />

      <section className="bg-gradient-to-r from-yellow-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 scroll-mt-32">How to Hire a Freelancer</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Follow these proven steps to find skilled freelancers, set clear expectations, and deliver great outcomes.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/services" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition">Browse Services</Link>
            <Link to="/how-to-find-work" className="inline-block bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:shadow-md transition">Tips for Freelancers</Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Define the project clearly', body: 'Write a concise brief with goals, deliverables, timeline and budget. Clear briefs attract better proposals.' },
            { title: 'Search and shortlist candidates', body: 'Use filters for skills, ratings, and past work. Shortlist 3–5 candidates and review portfolios and reviews closely.' },
            { title: 'Interview and assess', body: 'Ask about approach, timelines and past similar projects. Request examples or a short paid trial if unsure.' },
            { title: 'Agree terms and milestones', body: 'Set a clear scope, milestones, payment schedule and communication expectations before starting work.' },
            { title: 'Manage and give feedback', body: 'Use short, clear feedback cycles and share resources. Track progress against milestones and test deliverables early.' },
            { title: 'Close and review', body: 'Confirm final deliverables, release final payment, and leave an honest review to help others.' }
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
          <Link to="/services" className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:brightness-95 transition">Post a Job</Link>
        </div>
      </main>
    </div>
  );
}

export default HowToHire;
