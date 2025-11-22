import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart,
  Clock,
  Menu,
  X,
  Brain,
  Target,
  Calendar,
  AlertCircle
} from "lucide-react";

const Nav = ({ onGetStarted, isLoggedIn }: { onGetStarted: () => void, isLoggedIn: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                StudentFlow
              </span>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase mt-0.5">
                AI Productivity
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Features</button>
            <button className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">AI Engine</button>
            <button className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Pricing</button>

            <button
              onClick={onGetStarted}
              className="ml-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-6 animate-fade-in">
            <div className="flex flex-col gap-4 text-lg font-medium text-slate-600 dark:text-slate-300">
              <button className="text-left py-2 hover:text-sky-600 transition-colors">Features</button>
              <button className="text-left py-2 hover:text-sky-600 transition-colors">AI Engine</button>
              <button className="text-left py-2 hover:text-sky-600 transition-colors">Pricing</button>

              <button
                onClick={onGetStarted}
                className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-white font-semibold text-center shadow-lg"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const FadeInSection: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
    >
      {children}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300 hover:-translate-y-1 relative z-10">
    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute bottom-40 right-40 w-64 h-64 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1000"></div>
  </div>
);

const Modal = ({ isOpen, onClose, title, message }: { isOpen: boolean; onClose: () => void; title: string; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
        <div className="flex items-center gap-3 text-amber-500 mb-4">
          <AlertCircle size={28} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleNavigation = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handlePlanClick = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden font-sans selection:bg-sky-200 selection:text-sky-900 relative">
      <BackgroundAnimation />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Plan Not Available"
        message="We are currently rolling out premium features to a limited set of users. Please check back later or start with the free plan!"
      />

      <Nav onGetStarted={handleNavigation} isLoggedIn={isLoggedIn} />

      {/* HERO */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-sky-200/40 dark:bg-sky-900/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 animate-fade-in-up backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">v1.0 Now Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
              Master Your Studies with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 animate-gradient">
                Intelligent Focus
              </span>
            </h1>

            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Stop juggling multiple apps. StudentFlow combines task management, habit tracking, and AI-driven insights into one seamless workflow designed for academic success.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleNavigation}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 hover:brightness-110 text-white font-bold text-lg shadow-xl shadow-sky-500/25 hover:shadow-2xl hover:shadow-sky-500/40 hover:-translate-y-1 transition-all flex items-center gap-2 group"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start for Free'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-8 py-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-slate-600 dark:border-l-slate-300 border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
                Watch Demo
              </button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-slate-400 dark:text-slate-500 grayscale opacity-70">
              {/* Trust Badges / Logos Placeholder */}
              <div className="font-bold text-xl">MIT</div>
              <div className="font-bold text-xl">Stanford</div>
              <div className="font-bold text-xl">Harvard</div>
              <div className="font-bold text-xl">Berkeley</div>
            </div>
          </FadeInSection>
        </div>
      </main>

      {/* FEATURES GRID */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to excel</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We've analyzed the habits of top-performing students to build a tool that actually works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInSection delay={0}>
              <FeatureCard
                icon={<Calendar size={28} />}
                title="Smart Scheduling"
                description="Our AI automatically organizes your tasks around your classes and exams to maximize productivity."
              />
            </FadeInSection>
            <FadeInSection delay={100}>
              <FeatureCard
                icon={<Brain size={28} />}
                title="AI Insights"
                description="Get personalized study recommendations and performance analysis based on your learning patterns."
              />
            </FadeInSection>
            <FadeInSection delay={200}>
              <FeatureCard
                icon={<Clock size={28} />}
                title="Focus Timer"
                description="Built-in Pomodoro timer with customizable intervals to keep you focused and prevent burnout."
              />
            </FadeInSection>
            <FadeInSection delay={300}>
              <FeatureCard
                icon={<Target size={28} />}
                title="Goal Tracking"
                description="Set academic goals and track your progress with visual milestones and achievements."
              />
            </FadeInSection>
            <FadeInSection delay={400}>
              <FeatureCard
                icon={<BarChart size={28} />}
                title="Analytics"
                description="Visualize your study habits with detailed charts and identify areas for improvement."
              />
            </FadeInSection>
            <FadeInSection delay={500}>
              <FeatureCard
                icon={<Zap size={28} />}
                title="Quick Capture"
                description="Instantly capture assignments and ideas before you forget them with our streamlined interface."
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple pricing for students</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Start for free, upgrade when you need more power.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {/* Free Plan */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all h-full relative z-10">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Starter</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Basic Task Management', 'Pomodoro Timer', '3 Active Projects', '7-Day History'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleNavigation}
                  className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-400 transition-all"
                >
                  Start Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="relative p-8 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl transform md:-translate-y-4 min-h-[520px] flex flex-col z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-teal-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
                <div className="text-sm font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wider mb-2">Pro Student</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$7</span>
                  <span className="text-slate-300 dark:text-slate-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Unlimited Tasks & Projects', 'Advanced AI Insights', 'Unlimited History', 'Priority Support', 'Custom Themes'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-200 dark:text-slate-700">
                      <CheckCircle size={18} className="text-sky-400 dark:text-sky-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handlePlanClick}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:brightness-110 text-white font-bold shadow-lg transition-all"
                >
                  Get Pro
                </button>
              </div>

              {/* Team Plan */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all h-full relative z-10">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Study Group</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">$20</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Everything in Pro', 'Team Collaboration', 'Shared Projects', 'Admin Controls'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handlePlanClick}
                  className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-400 transition-all"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-teal-400"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to optimize your study routine?
          </h2>
          <p className="text-xl text-sky-50 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are achieving more with less stress using StudentFlow AI.
          </p>
          <button
            onClick={handleNavigation}
            className="px-10 py-4 rounded-full bg-white text-sky-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-bold text-slate-900 dark:text-white">StudentFlow</span>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} StudentFlow AI. All rights reserved.
          </div>

          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-sky-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-sky-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-sky-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};