import React from 'react'

const features = [
  'AI-based handwriting & equation recognition',
  'Automated subjective & MCQ evaluation',
  'Multi-sheet upload & processing',
  'Auto question–answer mapping',
  'Bias-free AI scoring',
  'Question bank with difficulty tags',
  'Study material & syllabus upload',
  'E-book integration',
  'Role-based access control',
];

export default function Features() {
  return (
    <section id="features" className="w-full text-white bg-white/0 py-16">
      <div className="w-full px-22">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3">Features</h2>
        <p className="text-center text-muted max-w-2xl mx-auto mb-10">Short form overview of core capabilities.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f} className="p-6 rounded-xl bg-[#0b1220] border border-[#0f1a2b] text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#6d5df6] to-[#3b82f6] flex items-center justify-center text-white font-semibold">✓</div>
                <div>
                  <div className="font-semibold">{f}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
