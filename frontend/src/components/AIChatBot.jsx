import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  Phone,
  Clock,
  Shield,
  Stethoscope,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

// Comprehensive Knowledge Base for Avenue Multi-Specialty Hospital
const HOSPITAL_KNOWLEDGE = {
  name: "Avenue Multi-Specialty Hospital",
  tagline: "Your Health, Our Priority",
  emergency_phone: "+1 (800) 427-9911",
  general_phone: "+1 (800) 427-9000",
  email: "care@avenuehospital.com",
  address: "742 Evergreen Healthcare Blvd, Medical District, NY 10001",
  hours: "Emergency: 24/7/365 | Outpatient OPD: Mon - Sat: 8:00 AM - 8:00 PM | Sunday: Special Clinics & Emergency Only",
  departments: [
    { name: "Cardiology", head: "Dr. Anthony F. Chen", fee: "₹1,200", details: "Heart failure clinic, coronary angiography, echocardiography, cardiac rehab." },
    { name: "Neurology & Stroke Care", head: "Dr. Sarah Jenkins", fee: "₹1,100", details: "Stroke center, video EEG, epilepsy, Parkinson's & multiple sclerosis." },
    { name: "Orthopedics & Spine", head: "Dr. Michael Vance", fee: "₹1,000", details: "Robotic knee/hip replacement, arthroscopy, sports injury recovery." },
    { name: "Pediatrics & Neonatology", head: "Dr. Emily Rodriguez", fee: "₹800", details: "Level III NICU/PICU, child immunizations, developmental care." },
    { name: "Dermatology & Cosmetology", head: "Dr. Priya Sharma", fee: "₹900", details: "Laser therapy, acne scar remodeling, skin cancer screening." },
    { name: "General Medicine & Diabetology", head: "Dr. David Miller", fee: "₹750", details: "Executive checkups, chronic disease, hypertension & diabetes care." },
    { name: "Gynecology & Obstetrics", head: "Dr. Amanda Lee", fee: "₹950", details: "High-risk pregnancy, 3D/4D fetal scans, laparoscopic surgeries." },
    { name: "Dental Sciences & Maxillofacial", head: "Dr. James Wilson", fee: "₹700", details: "Computerized implants, pain-free root canals, smile makeovers." },
    { name: "Ophthalmology & Retina", head: "Dr. Elena Rostova", fee: "₹1,050", details: "Bladeless cataract surgery, retinal lasers, LASIK, glaucoma care." },
    { name: "Emergency & Trauma Care (24/7)", head: "Dr. Marcus Vance", fee: "Emergency Triage", details: "24/7 resuscitation, trauma suites, emergency cath lab, ambulance." },
  ],
  doctors: [
    { name: "Dr. Anthony F. Chen", spec: "Senior Interventional Cardiologist", fee: "₹1,200", days: "Mon - Fri" },
    { name: "Dr. Sarah Jenkins", spec: "Chief Neurologist & Stroke Specialist", fee: "₹1,100", days: "Mon, Tue, Thu, Fri, Sat" },
    { name: "Dr. Michael Vance", spec: "Senior Orthopedic & Joint Surgeon", fee: "₹1,000", days: "Mon, Wed, Thu, Sat" },
    { name: "Dr. Emily Rodriguez", spec: "Lead Pediatric Specialist", fee: "₹800", days: "Mon - Sat (except Thu)" },
    { name: "Dr. Priya Sharma", spec: "Consultant Dermatologist", fee: "₹900", days: "Tue - Fri" },
    { name: "Dr. David Miller", spec: "Senior Internal Medicine Physician", fee: "₹750", days: "Mon - Sat" },
    { name: "Dr. Amanda Lee", spec: "Senior Obstetrician & Gynecologist", fee: "₹950", days: "Mon, Wed, Thu, Sat" },
    { name: "Dr. James Wilson", spec: "Consultant Dental Surgeon", fee: "₹700", days: "Tue, Thu, Fri, Sat" },
    { name: "Dr. Elena Rostova", spec: "Senior Vitreoretinal & Cataract Surgeon", fee: "₹1,050", days: "Mon, Tue, Wed, Fri" }
  ],
  payment: "We accept all major Credit/Debit Cards, UPI, NetBanking through secure Razorpay payment gateway. Payments are verified in real-time."
};

const SUGGESTED_QUERIES = [
  "How do I book an appointment?",
  "What are the doctor consultation fees?",
  "Which departments do you have?",
  "24/7 Emergency contact number?",
  "How does Razorpay payment work?",
  "What are the visiting hours?"
];

export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'bot',
      text: "Hello! 👋 I'm **Avenue AI**, your 24/7 hospital assistant. How can I help you today? You can ask me about our doctors, departments, consultation fees, appointment booking, or emergency care.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: "Book Appointment", path: "/book" },
        { label: "Find Doctors", path: "/doctors" },
        { label: "Our Departments", path: "/departments" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Intelligent matching engine to provide context-aware answers
  const generateBotResponse = (query) => {
    const q = query.toLowerCase().trim();

    // Emergency queries
    if (q.includes('emergency') || q.includes('ambulance') || q.includes('urgent') || q.includes('trauma') || q.includes('casualty') || q.includes('accident')) {
      return {
        text: `🚨 **24/7 Emergency Trauma & Ambulance**\n\nFor immediate emergency assistance, call our dedicated trauma hotline:\n\n📞 **${HOSPITAL_KNOWLEDGE.emergency_phone}**\n\nOur Level-1 Trauma Center and emergency resuscitation suites operate 24 hours a day, 365 days a year with on-call surgical specialists and critical care ambulances.`,
        actions: [{ label: "Emergency Contact", path: "/contact" }]
      };
    }

    // Booking appointments
    if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('slot') || q.includes('visit')) {
      return {
        text: `📅 **Booking an Appointment is Easy!**\n\n1. Go to **Book Appointment** page.\n2. Choose clinical department & doctor.\n3. Pick your preferred date & time slot.\n4. Fill in patient information.\n5. Pay consultation fee securely via **Razorpay**.\n6. Receive instant verified booking confirmation with a digital token!\n\nYou can book anytime online.`,
        actions: [
          { label: "Book Consultation Now", path: "/book" },
          { label: "Browse Specialists", path: "/doctors" }
        ]
      };
    }

    // Fees and pricing
    if (q.includes('fee') || q.includes('price') || q.includes('cost') || q.includes('charge') || q.includes('rate') || q.includes('payment')) {
      const feesList = HOSPITAL_KNOWLEDGE.doctors.map(d => `• **${d.name}** (${d.spec}): **${d.fee}**`).join('\n');
      return {
        text: `💳 **Consultation Fees & Payment Information**\n\nOur OPD consultation fees range from ₹700 to ₹1,200 depending on the specialist:\n\n${feesList}\n\n*Tech and triage fees are currently **₹0 (Waived)**.*\n\nWe accept **UPI, Credit/Debit cards, and NetBanking** via the encrypted **Razorpay Test Gateway**.`,
        actions: [
          { label: "Book & Pay", path: "/book" }
        ]
      };
    }

    // Doctors query
    if (q.includes('doctor') || q.includes('specialist') || q.includes('physician') || q.includes('surgeon') || q.includes('staff')) {
      const docList = HOSPITAL_KNOWLEDGE.doctors.map(d => `• **${d.name}** — ${d.spec} (${d.days}) — *${d.fee}*`).join('\n');
      return {
        text: `🩺 **Our Esteemed Specialist Physicians**\n\n${docList}\n\nAll specialists are board-certified with 10+ years of clinical experience.`,
        actions: [
          { label: "View Doctor Profiles", path: "/doctors" },
          { label: "Book an Appointment", path: "/book" }
        ]
      };
    }

    // Specific doctor queries
    const matchedDoc = HOSPITAL_KNOWLEDGE.doctors.find(d => q.includes(d.name.toLowerCase()) || q.includes(d.name.split(' ').pop().toLowerCase()));
    if (matchedDoc) {
      return {
        text: `👨‍⚕️ **${matchedDoc.name}**\n\n• **Specialization:** ${matchedDoc.spec}\n• **Available Days:** ${matchedDoc.days}\n• **OPD Consultation Fee:** ${matchedDoc.fee}\n\nWould you like to book an appointment with ${matchedDoc.name}?`,
        actions: [
          { label: `Book with ${matchedDoc.name}`, path: "/book" }
        ]
      };
    }

    // Departments query
    if (q.includes('department') || q.includes('specialty') || q.includes('speciality') || q.includes('services') || q.includes('branches')) {
      const deptList = HOSPITAL_KNOWLEDGE.departments.map(dept => `• **${dept.name}** (Head: ${dept.head}) — *${dept.details}*`).join('\n');
      return {
        text: `🏥 **Our Specialized Clinical Departments**\n\n${deptList}\n\nEach department is equipped with modern diagnostics, dedicated OT suites, and intensive care units.`,
        actions: [
          { label: "Explore Departments", path: "/departments" },
          { label: "Hospital Services", path: "/services" }
        ]
      };
    }

    // Individual departments
    if (q.includes('cardio') || q.includes('heart')) {
      const d = HOSPITAL_KNOWLEDGE.departments[0];
      return {
        text: `❤️ **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** 24/7 Cath Lab, Echocardiography, Cardiac ICU.`,
        actions: [{ label: "Book Cardiology OPD", path: "/book" }]
      };
    }
    if (q.includes('neuro') || q.includes('brain') || q.includes('stroke')) {
      const d = HOSPITAL_KNOWLEDGE.departments[1];
      return {
        text: `🧠 **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Comprehensive Stroke Response Unit, Video EEG.`,
        actions: [{ label: "Book Neurology OPD", path: "/book" }]
      };
    }
    if (q.includes('ortho') || q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('spine')) {
      const d = HOSPITAL_KNOWLEDGE.departments[2];
      return {
        text: `🦴 **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Robotic Joint Replacement, Sports Injury Clinic.`,
        actions: [{ label: "Book Orthopedics OPD", path: "/book" }]
      };
    }
    if (q.includes('pedia') || q.includes('child') || q.includes('baby') || q.includes('infant')) {
      const d = HOSPITAL_KNOWLEDGE.departments[3];
      return {
        text: `👶 **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Level III NICU & PICU, Well-Child Clinics.`,
        actions: [{ label: "Book Pediatrics OPD", path: "/book" }]
      };
    }
    if (q.includes('skin') || q.includes('derma')) {
      const d = HOSPITAL_KNOWLEDGE.departments[4];
      return {
        text: `✨ **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Medical Laser Suite, Cosmetic Remodeling.`,
        actions: [{ label: "Book Dermatology OPD", path: "/book" }]
      };
    }
    if (q.includes('eye') || q.includes('ophthal')) {
      const d = HOSPITAL_KNOWLEDGE.departments[8];
      return {
        text: `👁️ **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Bladeless Cataract Suite, LASIK, Retinal Lasers.`,
        actions: [{ label: "Book Ophthalmology OPD", path: "/book" }]
      };
    }
    if (q.includes('dental') || q.includes('teeth') || q.includes('tooth')) {
      const d = HOSPITAL_KNOWLEDGE.departments[7];
      return {
        text: `🦷 **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** Digital Guided Implants, Invisible Aligners.`,
        actions: [{ label: "Book Dental OPD", path: "/book" }]
      };
    }
    if (q.includes('women') || q.includes('gynae') || q.includes('pregnancy') || q.includes('maternity')) {
      const d = HOSPITAL_KNOWLEDGE.departments[6];
      return {
        text: `🌸 **${d.name}**\n\n• **Head:** ${d.head}\n• **Fee:** ${d.fee}\n• **Key Services:** ${d.details}\n• **Facilities:** High-Risk Delivery Suites, 3D/4D Fetal Scans.`,
        actions: [{ label: "Book Gynecology OPD", path: "/book" }]
      };
    }

    // Hours, address & location
    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('timing') || q.includes('visit') || q.includes('location') || q.includes('address') || q.includes('where')) {
      return {
        text: `🏥 **Hospital Hours & Location**\n\n📍 **Address:** ${HOSPITAL_KNOWLEDGE.address}\n\n⏰ **Operating Hours:**\n• **Emergency & ICU:** Open 24/7 (All days)\n• **Outpatient Clinics (OPD):** Monday – Saturday: 8:00 AM – 8:00 PM\n• **Pharmacy & Lab:** 24/7 Available\n\n📞 **Phone:** ${HOSPITAL_KNOWLEDGE.general_phone}`,
        actions: [{ label: "Contact & Directions", path: "/contact" }]
      };
    }

    // Login and accounts
    if (q.includes('login') || q.includes('sign in') || q.includes('register') || q.includes('account') || q.includes('password') || q.includes('portal') || q.includes('dashboard')) {
      return {
        text: `🔐 **Patient & Staff Portals**\n\nYou can log in using your registered email and password, or use the **1-Click Demo Logins** on the login page to preview:\n\n• **Patient Portal:** View upcoming appointments, payment receipts & history.\n• **Doctor Portal:** Manage your daily patient appointments and schedule.\n• **Admin Portal:** Manage doctors, departments, revenue and stats.`,
        actions: [
          { label: "Go to Login", path: "/login" },
          { label: "Create Account", path: "/register" }
        ]
      };
    }

    // Default intelligent fallback
    return {
      text: `Thank you for asking! I can help you with anything regarding **Avenue Multi-Specialty Hospital**:\n\n• **Doctors & Specializations** (Cardiology, Neurology, Orthopedics, etc.)\n• **Consultation Fees & Razorpay Payment**\n• **Appointment Booking & Availability**\n• **24/7 Emergency & Ambulance Dispatch**\n• **Patient & Doctor Dashboards**\n\nPlease select one of the topics below or type your specific question!`,
      actions: [
        { label: "Book Appointment", path: "/book" },
        { label: "Our Doctors", path: "/doctors" },
        { label: "Contact Hospital", path: "/contact" }
      ]
    };
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(userText);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: botResponse.actions || []
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleQuickQuery = (queryText) => {
    setInputValue(queryText);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(queryText);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: botResponse.actions || []
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleActionClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Hospital AI Assistant"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-700 hover:to-cyan-600 text-white px-4 py-3.5 rounded-full shadow-xl shadow-primary-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          </div>
          <span className="text-sm font-bold tracking-wide">
            Avenue AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-cyan-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm tracking-tight text-white">
                    Avenue AI Medical Assistant
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online • Instant Healthcare Answers</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick suggestions header ribbon */}
          <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {SUGGESTED_QUERIES.slice(0, 4).map((sq, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuery(sq)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-600 transition shrink-0"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-primary-200 dark:border-primary-900">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-line">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('• ') || line.startsWith('* ')) {
                        return <p key={idx} className="my-0.5">{line}</p>;
                      }
                      return <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{line}</p>;
                    })}
                  </div>

                  {/* Contextual Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.path)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-600 dark:text-cyan-400 font-semibold text-[11px] border border-primary-200 dark:border-primary-800 transition"
                        >
                          <span>{act.label}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'
                  }`}>
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about doctors, booking, fees..."
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent dark:border-slate-700"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send Message"
              className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
