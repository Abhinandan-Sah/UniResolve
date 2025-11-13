import React from 'react';

const partners = [
  { name: 'ETS (Educational Testing Service)' },
  { name: 'Cambridge Assessment' },
  { name: 'Pearson VUE' },
  { name: 'ACT' },
  { name: 'College Board' },
  { name: 'British Council' },
];

export default function Partners() {
  return (
    <section id="partners" className="w-full bg-[#071026] text-white py-16 mt-12">
      <div className="w-full px-22">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3">Partnered with Leading Exam Bodies</h2>
        <p className="text-center text-muted max-w-2xl mx-auto mb-10">Trusted by major testing organizations worldwide for reliable assessment solutions</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div key={p.name} className="p-6 rounded-xl bg-[#0b1220] border border-[#0f1a2b] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#6d5df6] to-[#3b82f6] flex items-center justify-center text-white font-semibold"> 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted mt-1">Professional partnership</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
