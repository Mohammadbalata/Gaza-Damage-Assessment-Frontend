import { WhatsApp } from "@mui/icons-material";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              {t("footer.about.title")}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("footer.about.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              {t("footer.links.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-[#f5a623] transition-colors"
                >
                  {t("footer.links.about")}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("departments")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-[#f5a623] transition-colors"
                >
                  {t("footer.links.departments")}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("partners")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-[#f5a623] transition-colors"
                >
                  {t("footer.links.partners")}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-[#f5a623] transition-colors"
                >
                  {t("footer.links.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              {t("footer.contact.title")}
            </h3>
            <div className="flex flex-col gap-5">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="tel:+970599366036"
                      target="_blank"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                    >
                      +970599366036
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="mailto:info@example.com"
                      target="_blank"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                    >
                      info@example.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <WhatsApp className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="https://wa.me/+970599366036"
                      target="_blank"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                    >
                      +970599366036
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
                      {t("contactInfo.gaza.address")}
                      <br />
                    </p>
                  </div>
                </li>
              </ul>
              <div className="border-b-2 border-dashed border-b-white/50 w-[60%]"></div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="tel:+17182000761"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                      target="_blank"
                    >
                      +17182000761
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="mailto:info@example.com"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                      target="_blank"
                    >
                      info@example.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <WhatsApp className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="https://wa.me/+17182000761"
                      target="_blank"
                      className="text-gray-300 hover:text-[#f5a623] transition-colors"
                    >
                      +17182000761
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
                      332 94th st Brooklyn ny
                      <br />
                      United States 11209
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              {t("footer.workingHours.title")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">
                      {t("footer.workingHours.weekdays")}
                    </span>
                    <br />
                    {t("footer.workingTime")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">
                      {t("footer.workingHours.friday")}:
                    </span>
                    <br />
                    <span className="text-[#f5a623]">
                      {t("footer.workingHours.closed")}
                    </span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#f5a623] p-3 rounded-full transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#f5a623] p-3 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#f5a623] p-3 rounded-full transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#f5a623] p-3 rounded-full transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <p className="text-gray-400 text-center">
              {t("footer.rights.part1")} {currentYear}{" "}
              {t("footer.rights.part2")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
