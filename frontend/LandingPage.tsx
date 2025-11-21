import React, { useEffect, useRef, useState } from "react";


const Nav = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-sm bg-white/90 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400">
              StudentFlow
            </div>
            <div className="text-xs text-slate-600 ml-1">AI Productivity</div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <button className="hover:text-slate-900 transition">Features</button>
            <button className="hover:text-slate-900 transition">AI Engine</button>
            <button className="hover:text-slate-900 transition">Pricing</button>

            <button
              onClick={onGetStarted}
              className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 shadow-md hover:scale-[1.02] transition text-white"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-3 text-slate-700">
              <button className="text-left">Features</button>
              <button className="text-left">AI Engine</button>
              <button className="text-left">Pricing</button>

              <button
                onClick={onGetStarted}
                className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-white w-fit"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
};

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
    {children}
  </div>
);

const LandingPage: React.FC = () => {
  const handleGetStarted = () => {
    alert("Get Started clicked!");
  };

  return (
    <div className="min-h-screen text-slate-800 bg-gradient-to-b from-white to-slate-50">
      <Nav onGetStarted={handleGetStarted} />

      {/* HERO */}
      <main className="relative overflow-hidden">
        {/* background blobs */}
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-sky-300 to-teal-300 opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-28 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-200 to-sky-200 opacity-40 blur-2xl"></div>

        <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <FadeInSection>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                Optimize your day with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-teal-400">
                  StudentFlow AI
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                An AI-powered productivity assistant built for students — plan your day,
                get smart suggestions, and stay on track with advanced analytics.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-white font-semibold shadow-xl hover:scale-[1.02] transition"
                >
                  Start Free
                </button>

                <button className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
                  Watch Demo
                </button>
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-20 pt-10">
        <FadeInSection>
          <div className="grid md:grid-cols-3 gap-8 -mt-8">

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="flex items-center gap-4">
                <FeatureIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </FeatureIcon>
                <div>
                  <h3 className="text-slate-900 font-semibold">AI Scheduler</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Auto-places tasks into optimal focus windows.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="flex items-center gap-4">
                <FeatureIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </FeatureIcon>
                <div>
                  <h3 className="text-slate-900 font-semibold">Productivity Scoring</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Find your peak hours with pattern analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="flex items-center gap-4">
                <FeatureIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 11h8" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M10 15h4" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </FeatureIcon>
                <div>
                  <h3 className="text-slate-900 font-semibold">Analytics Dashboard</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Weekly & monthly visual breakdowns.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </FadeInSection>
      </section>

      {/* PRICING */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <FadeInSection>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Simple pricing for students</h3>
            <p className="text-slate-600 mt-2">
              Start free — upgrade for advanced analytics and priority suggestions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-md">
              <div className="text-slate-700 uppercase text-sm">Free</div>
              <div className="mt-4 text-3xl font-bold text-slate-900">$0</div>
              <div className="mt-2 text-slate-600">Basic AI features</div>
              <button className="mt-6 px-6 py-2 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                Start
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-400 shadow-xl text-center">
              <div className="text-white uppercase text-sm">Pro</div>
              <div className="mt-4 text-3xl font-bold text-white">$7</div>
              <div className="mt-2 text-white">per month</div>

              <button className="mt-6 px-6 py-2 rounded-full bg-white text-sky-700 font-semibold">
                Upgrade
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-md">
              <div className="text-slate-700 uppercase text-sm">Team</div>
              <div className="mt-4 text-3xl font-bold text-slate-900">$20</div>
              <div className="mt-2 text-slate-600">per month</div>

              <button className="mt-6 px-6 py-2 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                Contact
              </button>
            </div>

          </div>
        </FadeInSection>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-300 to-teal-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-bold text-slate-900">
            Ready to optimize your study routine?
          </h4>

          <p className="text-slate-700 mt-2">
            Start today and get instant AI suggestions for better focus.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-6 px-8 py-3 rounded-full bg-slate-900 text-white font-semibold"
          >
            Create Account — It's Free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} StudentFlow
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a className="text-slate-600 hover:text-slate-900">Terms</a>
            <a className="text-slate-600 hover:text-slate-900">Privacy</a>
            <a className="text-slate-600 hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
