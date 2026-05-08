export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f4fb] text-black">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#2F6DF6]">UP</span>
              <span>FUE</span>
            </h1>

            <div className="w-8 h-8 rounded-full border-2 border-[#79C9F7] flex items-center justify-center text-[#79C9F7] text-xs font-bold">
              ✦
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-12 text-[18px] font-medium text-[#1f1f1f]">
            <a href="#features" className="hover:text-[#2F6DF6] transition">
              Features
            </a>
            <a href="#benefits" className="hover:text-[#2F6DF6] transition">
              Benefits
            </a>
            <a href="#testimonials" className="hover:text-[#2F6DF6] transition">
              Testimonials
            </a>
            <a href="#contact" className="hover:text-[#2F6DF6] transition">
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <button className="bg-[#2F6DF6] hover:bg-[#1f5be6] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md transition-all duration-300">
            Book Free Demo →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-3 border border-[#2F6DF6] text-[#2F6DF6] rounded-full px-6 py-3 text-lg bg-white/60 backdrop-blur-sm mb-10">
            <span className="w-3 h-3 rounded-full bg-[#2F6DF6]"></span>
            Available with EDG support
          </div>

          {/* Heading */}
          <h2 className="text-[52px] md:text-[52px] leading-[1.05] font-extrabold tracking-tight mb-6">
            Built for <span className="text-[#2F6DF6]">Singapore</span>
            <br />
            Workshops
          </h2>

          {/* Description */}
          <p className="text-2xl text-[#202020] mb-12 max-w-xl">
            Run your workshop smarter, not harder
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-14">
            <button className="bg-[#2F6DF6] hover:bg-[#1f5be6] text-white px-10 py-5 rounded-full text-1xl font-semibold shadow-lg transition-all duration-300">
              Book Free Demo →
            </button>

            <button className="bg-white hover:bg-gray-50 text-[#111111] px-10 py-5 rounded-full text-1xl font-semibold shadow-md transition-all duration-300 border border-gray-100">
              Check EDG Eligibility
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 max-w-2xl">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-3xl font-bold mb-3">15min</h3>
              <p className="text-gray-500 text-lg">Saved per claim</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-3xl font-bold mb-3">+20%</h3>
              <p className="text-gray-500 text-lg">More jobs</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-3xl font-bold mb-3">$8K</h3>
              <p className="text-gray-500 text-22px">Profit found</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="rounded-[36px] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1400&auto=format&fit=crop"
              alt="Workshop"
              className="w-full h-[650px] object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
