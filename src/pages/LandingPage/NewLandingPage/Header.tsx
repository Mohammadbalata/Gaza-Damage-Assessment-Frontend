import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-[#1e3a5f] bg-header h-24  shadow-lg z-50">
      <div className="mx-auto px-4 max-w-[1050px]  ">

        {/* Main navigation */}
        <div className="flex items-center justify-between py-[16px] gap-8 h-[90px]">
          <img src="../../../../src/assets/logo-width.png" className=' logo w-80 h-20' alt="this is logo" />
          

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#f5a623] transition-colors">الرئيسية</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-[#f5a623] transition-colors">من نحن</button>
            <button onClick={() => scrollToSection('departments')} className="hover:text-[#f5a623] transition-colors">أقسامنا</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#f5a623] transition-colors">معرض الصور</button>
            <button onClick={() => scrollToSection('map')} className="hover:text-[#f5a623] transition-colors">موقعنا</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#f5a623] transition-colors">تواصل معنا</button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2 bg-[#1f395f] lg:bg-transparent text-white">
            <button onClick={() => scrollToSection('hero')} className="block w-full text-right px-4 py-3  hover:text-[#f5a623] transition-colors">الرئيسية</button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-right px-4 py-3 hover:text-[#f5a623] transition-colors">من نحن</button>
            <button onClick={() => scrollToSection('departments')} className="block w-full text-right px-4 py-3 hover:text-[#f5a623] transition-colors">أقسامنا</button>
            <button onClick={() => scrollToSection('gallery')} className="block w-full text-right px-4 py-3 hover:text-[#f5a623] transition-colors">معرض الصور</button>
            <button onClick={() => scrollToSection('map')} className="block w-full text-right px-4 py-3 hover:text-[#f5a623] transition-colors">موقعنا</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-right px-4 py-3 hover:text-[#f5a623] transition-colors">تواصل معنا</button>
          </nav>
        )}
      </div>
    </header>
  );
}
