import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { showToast, language } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all contact fields.');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry sent! Coach Marcus Vance will respond via email.');
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-20 bg-[#f8fafd] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Google Maps Location & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider mb-1">
                Google Maps & Facility Access
              </div>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
                Visit the <span className="font-semibold text-[#1a73e8]">facility</span>
              </h2>
              <p className="text-[#5f6368] text-sm mt-1">
                {language === 'en'
                  ? 'Tour our weight room, dojo, and cardio suites or meet with coach staff.'
                  : 'Visitez nos installations sportives ou prenez rendez-vous avec un entraîneur.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3.5 p-4 bg-[#ffffff] rounded-2xl border border-[#e0e2ec] shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#fce8e6] text-[#ea4335] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#1f1f1f]">TM3 Martial Arts Academy & Pro Shop</div>
                  <div className="text-xs text-[#444746] mt-0.5">1420 Athletic Way, Suite 100 · Main Dojang & Studio B</div>
                  <div className="text-[11px] text-[#747775]">Pro Shop at Front Desk: Uniforms (XS–XXL) & Sparring Gear</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-[#ffffff] rounded-2xl border border-[#e0e2ec] shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#1f1f1f]">Program & Class Hours</div>
                  <div className="text-xs text-[#444746] mt-0.5">
                    Group Workouts: 6:00–7:00 AM (M/W/F) · 9:00–10:00 AM (M–F) · 6:30–7:00 PM (M–F)
                  </div>
                  <div className="text-[11px] text-[#747775] mt-0.5">
                    Dancing Classes (M/W/F or T/Th/Sat): 10:30–11:30 AM · 4:00–5:00 PM · 7:30–8:30 PM
                  </div>
                  <div className="text-[11px] text-[#1a73e8] font-medium mt-0.5">
                    Taekwondo: Tue, Wed, Thu, Fri at 5:15 PM & Sat at 10:00 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-[#ffffff] rounded-2xl border border-[#e0e2ec] shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#c4eed0] text-[#137333] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#1f1f1f]">Official Academy Contact</div>
                  <div className="text-xs text-[#1a73e8] font-medium mt-0.5">tm3martialartsacademy@gmail.com</div>
                  <div className="text-[11px] text-[#747775]">+1 (555) 867-7678 · https://tm3gym.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Google Form Style Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
                <h3 className="text-lg font-semibold text-[#1f1f1f]">
                  {language === 'en' ? 'Send a Message' : 'Envoyer un message'}
                </h3>
              </div>
              <p className="text-xs text-[#5f6368] mb-6">
                Have questions regarding youth Taekwondo registration, personal training, or group rates? Let us know.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-[#f0f4f9] rounded-2xl text-[#137333] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#34a853] mx-auto" />
                  <div className="font-semibold text-sm text-[#1f1f1f]">Message Delivered!</div>
                  <p className="text-xs text-[#5f6368]">
                    Thank you, {name}. A member of our coaching team will reply to {email} shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jordan Miller"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan@domain.com"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444746] mb-1">
                      Message or Inquiry
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I'm interested in youth Taekwondo and weekend summit hikes..."
                      required
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-all shadow-xs hover:shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
