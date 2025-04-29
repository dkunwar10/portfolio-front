
import { useProfile } from '@/store/ProfileContext';
import { Github as GitHubIcon, Linkedin as LinkedInIcon, Mail as MailIcon, ExternalLink, Phone as PhoneIcon, BookOpen as BookIcon } from 'lucide-react';

const Footer = () => {
  const { profileData } = useProfile();
  const name = profileData?.profile.name || 'Diwas Kunwar';
  const urls = profileData?.profile.Urls || [];

  const currentYear = new Date().getFullYear();

  // Map URL names to icons
  const getIconForUrl = (urlName: string) => {
    switch (urlName) {
      case 'GitHub':
        return GitHubIcon;
      case 'LinkedIn':
        return LinkedInIcon;
      case 'Email':
        return MailIcon;
      case 'Website':
        return ExternalLink;
      case 'Hugging Face':
        return BookIcon;
      case 'Phone':
        return PhoneIcon;
      default:
        return ExternalLink;
    }
  };

  // Create social links from all URLs in the profile data
  const socialLinks = urls.map(url => ({
    name: url.name,
    icon: getIconForUrl(url.name),
    url: url.url
  }));

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} {name}. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
