import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SiFiverr, SiUpwork } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 pt-6 pb-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="flex flex-col items-center gap-4">
        {/* 🌐 Social Links */}
        <div className="flex gap-6 justify-center">
          

          <a
            href="https://www.linkedin.com/in/kishore-shan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-primary)] transition"
            aria-label="LinkedIn"
          >
            <Linkedin size={22} />
          </a>

          <a
            href="mailto:kishoreshan2801@gmail.com"
            className="hover:text-[#FF6B6B] transition"
            aria-label="Email"
          >
            <Mail size={22} />
          </a>
          <a
            href="https://github.com/Kishores2801"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-primary)] transition"
            aria-label="GitHub"
          >
            <Github size={22} />
          </a>

          <a
            href="https://www.fiverr.com/users/kishore_data"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DBF73] transition"
            aria-label="Fiverr"
          >
            <SiFiverr size={22} />
          </a>

          <a
            href="https://www.upwork.com/freelancers/~01ed5351b55a5e345c"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#6FDA44] transition"
            aria-label="Upwork"
          >
            <SiUpwork size={22} />
          </a>

          <a
            href="https://www.instagram.com/kishore_shan_28/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E1306C] transition"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>

          
        </div>

        {/* 🧾 Copyright */}
        <p className="text-xs text-gray-500 dark:text-gray-400 flex flex-col md:flex-row gap-2 items-center">
          <span>© {new Date().getFullYear()} Kishore. All rights reserved.</span>
          <a href="/sitemap.xml" className="hover:text-primary transition-colors">
            Sitemap
          </a>
        </p>
      </div>
    </footer>
  );
}