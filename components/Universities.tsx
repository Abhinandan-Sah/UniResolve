import React from 'react';

const universities = [
  { name: 'Harvard University', stat: '20,000+ students', initial: 'H' },
  { name: 'Stanford University', stat: '15,000+ students', initial: 'S' },
  { name: 'MIT', stat: '18,000+ students', initial: 'M' },
  { name: 'Oxford University', stat: '25,000+ students', initial: 'O' },
  { name: 'Cambridge University', stat: '22,000+ students', initial: 'C' },
  { name: 'Yale University', stat: '14,000+ students', initial: 'Y' },
  { name: 'Princeton University', stat: '12,000+ students', initial: 'P' },
  { name: 'UC Berkeley', stat: '30,000+ students', initial: 'U' },
];

export default function Universities() {
  return (
    <section id="universities" className="w-full bg-[#071026] py-16 text-white mt-12 rounded-md">
      <div className="w-full px-22">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3">Trusted by Leading Universities</h2>
        <p className="text-center text-muted max-w-2xl mx-auto mb-10">Join hundreds of educational institutions using our platform for accurate assessments.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {universities.map((u) => (
            <div key={u.name} className="p-6 rounded-xl bg-[#0b1220] border border-[#0f1a2b] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#18203a] to-[#2b2f5a] flex items-center justify-center text-white text-lg font-bold mb-4">
                {u.initial}
              </div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-muted mt-2">{u.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
