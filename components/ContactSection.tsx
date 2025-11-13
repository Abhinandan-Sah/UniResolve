"use client";

import React, { useState } from 'react';

export default function ContactSection() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus('sending');

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message: `${subject}\n\n${message}` }),
			});

			if (res.ok) {
				setStatus('success');
				setName(''); setEmail(''); setSubject(''); setMessage('');
			} else {
				setStatus('error');
			}
		} catch (error) {
			void error;
			setStatus('error');
		}
	}

	return (
		<section id="contact"  className="w-full py-16 text-white">
			<div className="max-w-4xl mx-auto px-6">
				<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3">Contact Us</h2>
				<p className="text-center text-muted max-w-2xl mx-auto mb-8">Have questions or want a demo? Send us a message and we will get back to you within 48 hours.</p>

				<div className="bg-[#0b1220] border border-[#0f1a2b] rounded-lg p-8 shadow-md">
					<h3 className="text-2xl font-semibold text-white mb-2">Send a message</h3>

					<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="px-3 py-2 rounded bg-[#061023] border border-[#122033] text-white outline-none" />
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className="px-3 py-2 rounded bg-[#061023] border border-[#122033] text-white outline-none" />
						</div>

						<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="px-3 py-2 rounded bg-[#061023] border border-[#122033] text-white outline-none" />

						<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Message" className="px-3 py-2 rounded bg-[#061023] border border-[#122033] text-white outline-none resize-none" />

						<div className="flex items-center justify-between mt-2">
							<div>
								{status === 'success' && <span className="text-sm text-green-400">Message sent — thanks!</span>}
								{status === 'error' && <span className="text-sm text-rose-400">Failed to send. Try again later.</span>}
							</div>
							<button type="submit" disabled={status === 'sending'} className="bg-[#2563eb] hover:bg-[#1e50c8] text-white px-4 py-2 rounded font-semibold disabled:opacity-60">
								{status === 'sending' ? 'Sending...' : 'Send'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
