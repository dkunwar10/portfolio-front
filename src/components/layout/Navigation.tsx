
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Briefcase, Code, FolderGit2, Github, Award } from 'lucide-react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNavHovered, setIsNavHovered] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'professional-journey', label: 'Professional Journey', icon: Briefcase },
    { id: 'technical-expertise', label: 'Technical Expertise', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'github-activity', label: 'GitHub', icon: Github },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      sections.forEach(section => {
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No need for centering effect anymore

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Vertical Navigation */}
      <nav
        ref={navRef}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 flex-col items-center bg-transparent transition-all duration-500 ease-in-out w-56 overflow-visible"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        {/* Simplified navigation approach */}
        <div className="flex flex-col px-2 w-full">
          {navItems.map((item) => (
            <Button
              key={item.id}
              ref={item.id === activeSection ? activeItemRef : undefined}
              variant="ghost"
              className={`relative flex items-center justify-start px-3 py-2.5 rounded-full transition-all duration-300 w-full overflow-hidden whitespace-nowrap ${item.id === activeSection
                ? 'text-white bg-blue-600/30 font-medium ring-2 ring-blue-500/30 ring-offset-1 ring-offset-transparent'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
                }`}
              onClick={() => scrollToSection(item.id)}
              style={{
                // Only show active item by default, show all on hover
                display: item.id === activeSection || isNavHovered ? 'flex' : 'none',
                // Ensure consistent spacing
                marginBottom: '0.75rem',
                // Add transition for smooth appearance
                transition: 'all 0.3s ease-in-out',
              }}
              data-active={item.id === activeSection}
              data-section={item.id}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 transition-all duration-300 mr-3 ${item.id === activeSection ? 'text-blue-300' : 'text-gray-400'}`}
              />
              <span className="transition-opacity duration-300">
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-1/2 -translate-y-1/2 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className={`text-white hover:bg-blue-600/20 rounded-full transition-all duration-300 ${
            isMenuOpen ? 'bg-blue-600/30 rotate-90' : 'bg-gray-800/30 backdrop-blur-sm'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5 text-blue-300" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 h-full w-64 bg-gray-900/80 backdrop-blur-md z-40 animate-in slide-in-from-left duration-300 overflow-hidden">
          <div className="h-full flex flex-col justify-center px-4 space-y-4">
            {/* Active item first */}
            {navItems
              .filter(item => item.id === activeSection)
              .map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="relative flex items-center justify-start px-3 py-2.5 rounded-full transition-all duration-300 w-full overflow-hidden whitespace-nowrap text-white bg-blue-600/30 font-medium ring-2 ring-blue-500/30 ring-offset-1 ring-offset-transparent animate-in fade-in slide-in-from-left duration-300"
                  onClick={() => scrollToSection(item.id)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 mr-3 transition-all duration-300 text-blue-300" />
                  <span className="transition-opacity duration-300">
                    {item.label}
                  </span>
                </Button>
              ))}

            {/* Other items */}
            {navItems
              .filter(item => item.id !== activeSection)
              .map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="relative flex items-center justify-start px-3 py-2.5 rounded-full transition-all duration-300 w-full overflow-hidden whitespace-nowrap text-gray-400 hover:text-white hover:bg-gray-800/20 animate-in fade-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                  onClick={() => scrollToSection(item.id)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 mr-3 transition-all duration-300 text-gray-400" />
                  <span className="transition-opacity duration-300">
                    {item.label}
                  </span>
                </Button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
