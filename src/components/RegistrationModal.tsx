import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Dumbbell, Sparkles, ArrowRight, Check, ShieldCheck, KeyRound, HeartPulse } from 'lucide-react';
import { TM3_MEMBERSHIP_PLANS, isValidMemberPin } from '../utils/scheduleUtils';

export const RegistrationModal: React.FC = () => {
  const {
    isRegistrationOpen,
    setIsRegistrationOpen,
    selectedServiceForJoin,
    setSelectedServiceForJoin,
    services,
    registerNewMember,
    setRole,
    showToast
  } = useApp();

  const [onboardMode, setOnboardMode] = useState<'new' | 'claim'>('new');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Claim Existing Profile (4-Digit PIN from tm3gym.com/onboard)
  const [claimName, setClaimName] = useState('');
  const [claimPin, setClaimPin] = useState('');
  const [claimError, setClaimError] = useState('');

  // Form Fields (First-Time Registration)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [membershipPlanId, setMembershipPlanId] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    return selectedServiceForJoin ? [selectedServiceForJoin] : ['Group Workout Sessions'];
  });
  const [hasChild, setHasChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(8);
  const [childNotes, setChildNotes] = useState('');

  // Emergency Contact & Health History (from tm3gym.com/client-portal?tab=health)
  const [emName, setEmName] = useState('');
  const [emRelationship, setEmRelationship] = useState('Spouse / Parent');
  const [emPhone, setEmPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [waiverSigned, setWaiverSigned] = useState(false);

  const [completedMember, setCompletedMember] = useState<any | null>(null);

  if (!isRegistrationOpen) return null;

  const handleClose = () => {
    setIsRegistrationOpen(false);
    setSelectedServiceForJoin(null);
    setCompletedMember(null);
    setClaimError('');
    setStep(1);
  };

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimName.trim()) {
      setClaimError('Please enter the member or student full name.');
      return;
    }
    if (!isValidMemberPin(claimPin)) {
      setClaimError('Please enter a valid 4-digit Member PIN (e.g. 2026 or 8472).');
      return;
    }
    setClaimError('');
    showToast(`Profile claimed with PIN ${claimPin}! Welcome back to TM3 Martial Arts Academy.`);
    setRole('member');
    handleClose();
  };

  // Validation rules for stepper jumping
  const isStep1Valid = Boolean(fullName.trim() && email.trim() && phone.trim());
  const isStep2Valid = selectedServices.length > 0;

  const handleStepClick = (targetStep: 1 | 2 | 3) => {
    if (targetStep === 1) {
      setStep(1);
    } else if (targetStep === 2 && isStep1Valid) {
      setStep(2);
    } else if (targetStep === 3 && isStep1Valid && isStep2Valid) {
      setStep(3);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!isStep1Valid) return;
      setStep(2);
    } else if (step === 2) {
      if (!isStep2Valid) return;
      setStep(3);
    } else if (step === 3) {
      if (!emName || !emPhone || !waiverSigned) return;

      const chosenPlan = TM3_MEMBERSHIP_PLANS.find((p) => p.id === membershipPlanId) || TM3_MEMBERSHIP_PLANS[0];

      const newMember = registerNewMember({
        fullName,
        email,
        phone,
        services: selectedServices,
        emergencyContact: {
          name: emName,
          relationship: emRelationship,
          phone: emPhone
        },
        lastPaymentAmount: chosenPlan.price,
        notes: `Plan: ${chosenPlan.label} ($${chosenPlan.price}) · DOB: ${dob || 'N/A'} · Health/Waiver Signed by: ${signatureName || fullName}${medicalNotes ? ` · Health Notes: ${medicalNotes}` : ''}`,
        childProfile:
          hasChild || selectedServices.some((s) => s.toLowerCase().includes('taekwondo'))
            ? {
                childName: childName || 'Junior Athlete',
                age: Number(childAge),
                beltRank: 'White Belt (New Registrant)',
                medicalNotes: childNotes || medicalNotes || 'No specific notes entered'
              }
            : undefined
      });

      setCompletedMember(newMember);
    }
  };

  const stepsConfig: { num: 1 | 2 | 3; title: string; subtitle: string }[] = [
    { num: 1, title: 'Personal & Plan', subtitle: '$80 / $220 / $800' },
    { num: 2, title: 'Select Programs', subtitle: 'TKD, Workouts, Dance' },
    { num: 3, title: 'Health & Waiver', subtitle: 'Emergency & signature' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#ffffff] border border-[#dadce0] w-full max-w-xl rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] overflow-hidden my-8">
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f3f4] bg-[#f8fafd]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white shadow-2xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1f1f1f]">
                TM3 Martial Arts Academy · Member Onboarding
              </h3>
              <p className="text-[11px] text-[#5f6368]">
                {completedMember ? 'Enrollment Complete' : 'First-Time Registration or Claim Existing Profile with 4-Digit PIN'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-[#747775] hover:text-[#1f1f1f] hover:bg-[#e0e2ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onboarding Mode Switcher ("I'm new to TM3" vs "I already attend - 4-Digit PIN") */}
        {!completedMember && (
          <div className="px-6 pt-4 pb-2 bg-[#f8fafd] border-b border-[#e0e2ec]">
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#e8f0fe]/60 rounded-2xl border border-[#d2e3fc]">
              <button
                type="button"
                onClick={() => setOnboardMode('new')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  onboardMode === 'new'
                    ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs font-semibold'
                    : 'text-[#444746] hover:text-[#1f1f1f]'
                }`}
              >
                I'm New to TM3 (Register)
              </button>
              <button
                type="button"
                onClick={() => setOnboardMode('claim')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  onboardMode === 'claim'
                    ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs font-semibold'
                    : 'text-[#444746] hover:text-[#1f1f1f]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-[#f29900]" />
                <span>I Already Attend (4-Digit PIN)</span>
              </button>
            </div>
          </div>
        )}

        {/* PROGRESS STEPPER COMPONENT (only in 'new' mode) */}
        {!completedMember && onboardMode === 'new' && (
          <div className="bg-[#ffffff] border-b border-[#e0e2ec] px-6 pt-4 pb-4">
            <div className="w-full bg-[#f1f3f4] h-1 rounded-full mb-4 overflow-hidden">
              <div
                className="bg-[#1a73e8] h-full transition-all duration-300 ease-out rounded-full"
                style={{
                  width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%'
                }}
              />
            </div>

            <div className="flex items-center justify-between relative">
              {stepsConfig.map((item, index) => {
                const isCompleted = step > item.num;
                const isCurrent = step === item.num;
                const isClickable = isCompleted || (item.num === 2 && isStep1Valid);

                return (
                  <React.Fragment key={item.num}>
                    <button
                      type="button"
                      disabled={!isClickable && !isCurrent}
                      onClick={() => handleStepClick(item.num)}
                      className={`flex items-center gap-2.5 text-left transition-all group ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-[#34a853] text-white shadow-2xs'
                            : isCurrent
                            ? 'bg-[#1a73e8] text-white ring-4 ring-[#d3e3fd] shadow-2xs'
                            : 'bg-[#f0f4f9] border border-[#dadce0] text-[#747775]'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : item.num}
                      </div>

                      <div className="hidden sm:block">
                        <div
                          className={`text-xs font-medium leading-none ${
                            isCurrent
                              ? 'text-[#1a73e8] font-semibold'
                              : isCompleted
                              ? 'text-[#1f1f1f]'
                              : 'text-[#747775]'
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#747775] mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </button>

                    {index < stepsConfig.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                          step > index + 1 ? 'bg-[#34a853]' : 'bg-[#e0e2ec]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {completedMember ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-[#c4eed0] text-[#137333] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#1f1f1f]">
                  Registration Submitted!
                </h4>
                <div className="text-xs text-[#b06000] font-medium mt-1">
                  Status: PENDING COACH VERIFICATION
                </div>
              </div>

              <div className="bg-[#f8fafd] p-4 rounded-2xl border border-[#e0e2ec] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Applicant Name:</span>
                  <span className="text-[#1f1f1f] font-semibold">{completedMember.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Account ID:</span>
                  <span className="text-[#1f1f1f] font-mono">{completedMember.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Pass Barcode:</span>
                  <span className="text-[#1a73e8] font-mono font-semibold">{completedMember.qrCodeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Selected Programs:</span>
                  <span className="text-[#1f1f1f] font-medium text-right max-w-[240px]">
                    {completedMember.services.join(', ')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5f6368] leading-relaxed max-w-md mx-auto">
                Master Mulatu Biru & Coach Marcus will review your enrollment and activate your member pass.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setRole('pending');
                    handleClose();
                  }}
                  className="px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                >
                  View Application in Portal
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : onboardMode === 'claim' ? (
            <form onSubmit={handleClaimSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-[#feefc3]/60 border border-[#f29900]/40 rounded-2xl text-xs text-[#444746] space-y-1">
                <div className="font-semibold text-[#b06000] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Claim Your Existing TM3 Member Profile</span>
                </div>
                <p>
                  Enter your name and the <strong>4-digit Member PIN</strong> from the paper slip handed out in class (or ask the front desk). Parents can also claim their child's profile using their PIN.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1">
                  Member or Student Full Name *
                </label>
                <input
                  type="text"
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  placeholder="e.g. Alex Rivers or Lucas Lin"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1">
                  4-Digit Member PIN *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={claimPin}
                  onChange={(e) => setClaimPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="e.g. 8472"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-sm font-mono tracking-widest text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              {claimError && (
                <div className="text-xs text-[#c5221f] bg-[#fce8e6] px-3 py-2 rounded-xl">
                  {claimError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f3f4]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs"
                >
                  <span>Claim My Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNext} className="space-y-4">
              {/* STEP 1: Personal info & Membership Plan ($80 / $220 / $800) */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-[#1f1f1f]">Step 1 of 3: Member Details & Plan</span>
                    <span className="text-[11px] text-[#747775]">Required fields *</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Michael Thorne"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m.thorne@domain.com"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                  </div>

                  {/* TM3 Membership Dues Selector ($80 Monthly / $220 Quarterly / $800 Annual) */}
                  <div>
                    <label className="block text-xs font-medium text-[#444746] mb-1.5">
                      Membership Plan (TM3 Dues) *
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {TM3_MEMBERSHIP_PLANS.map((plan) => {
                        const active = membershipPlanId === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setMembershipPlanId(plan.id)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              active
                                ? 'bg-[#e8f0fe] border-[#1a73e8] ring-1 ring-[#1a73e8]'
                                : 'bg-[#f8fafd] border-[#dadce0] hover:bg-[#f1f3f4]'
                            }`}
                          >
                            <div className="text-[11px] font-semibold text-[#1f1f1f]">{plan.label}</div>
                            <div className="text-base font-bold font-mono text-[#1a73e8] mt-0.5">
                              ${plan.price}
                            </div>
                            <div className="text-[10px] text-[#5f6368] truncate">{plan.savingsLabel}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Service Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-[#1f1f1f]">Step 2 of 3: Choose Your Training Programs</span>
                    <span className="text-[11px] text-[#747775]">{selectedServices.length} selected</span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {services.map((srv) => {
                      const isSelected = selectedServices.includes(srv.title);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => toggleService(srv.title)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                              : 'bg-[#ffffff] border-[#dadce0] text-[#444746] hover:bg-[#f8fafd]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                                  : 'border-[#dadce0] bg-[#ffffff]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="font-semibold text-[#1f1f1f]">{srv.title}</div>
                              <div className="text-[11px] text-[#5f6368]">{srv.scheduleSummary}</div>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1f1f1f]">${srv.pricingMonthly}/mo</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Youth Student Profile */}
                  {(selectedServices.some((s) => s.toLowerCase().includes('taekwondo')) || hasChild) && (
                    <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#dadce0] space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#b06000]">
                        <Sparkles className="w-3.5 h-3.5 text-[#fbbc04]" />
                        <span>Taekwondo Student Profile (Youth / Family)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#444746] mb-1">
                            Student's Full Name
                          </label>
                          <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="e.g. Leo Thorne"
                            className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#444746] mb-1">
                            Student Age
                          </label>
                          <input
                            type="number"
                            min={4}
                            max={65}
                            value={childAge}
                            onChange={(e) => setChildAge(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Emergency contact, Health History & Digital Signature Waiver */}
              {step === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-[#1f1f1f]">Step 3 of 3: Health History & Liability Waiver</span>
                    <span className="text-[11px] text-[#747775]">Emergency & Signature</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#444746] mb-1">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        value={emName}
                        onChange={(e) => setEmName(e.target.value)}
                        placeholder="Contact Name"
                        required
                        className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#444746] mb-1">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={emPhone}
                        onChange={(e) => setEmPhone(e.target.value)}
                        placeholder="Contact Phone"
                        required
                        className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#444746] mb-1">
                      <HeartPulse className="w-3.5 h-3.5 text-[#ea4335]" />
                      <span>Health History (Medical Conditions, Allergies, Past Injuries)</span>
                    </label>
                    <input
                      type="text"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      placeholder="None, or list any allergies, asthma, past injuries, or physician notes"
                      className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                    />
                  </div>

                  <div className="p-3.5 bg-[#f8fafd] rounded-2xl border border-[#dadce0] text-xs text-[#5f6368] space-y-2.5">
                    <div className="font-semibold text-[#1f1f1f] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#34a853]" />
                      <span>TM3 Martial Arts Academy Liability Waiver</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      I acknowledge the physical nature of Taekwondo, Group Workout Sessions, and Dancing classes, and confirm that I (or my minor child) am medically fit to participate.
                    </p>
                    <div>
                      <input
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="Type Full Name as Digital Signature"
                        className="w-full px-3 py-1.5 bg-[#ffffff] border border-[#dadce0] rounded-lg text-xs font-medium text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-0.5 text-[#1f1f1f] font-medium">
                      <input
                        type="checkbox"
                        checked={waiverSigned}
                        onChange={(e) => setWaiverSigned(e.target.checked)}
                        className="w-4 h-4 text-[#1a73e8] rounded border-[#dadce0]"
                      />
                      <span>I agree to the liability waiver and membership terms</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Stepper Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f1f3f4]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="px-5 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={step === 3 && (!waiverSigned || !emName || !emPhone)}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#dadce0] disabled:text-[#747775] rounded-full transition-all shadow-xs"
                >
                  <span>{step === 3 ? 'Complete Registration' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
