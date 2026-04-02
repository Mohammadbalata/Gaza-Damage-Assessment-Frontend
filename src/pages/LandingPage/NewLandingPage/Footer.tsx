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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              منصة سوا بنعمرها
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
هي مبادرة شبابية مستقلة، بعيدة عن التجاذبات السياسية والفئوية، تهدف إلى جمع جهود المواطنين والجهات العاملة والمانحين في إطار واحد يخدم المجتمع، ويعزز المشاركة المجتمعية من خلال توفير منصة شفافة تتيح للمواطنين متابعة الخدمات، والإبلاغ عن احتياجاتهم، والتواصل المباشر مع الجهات المعنية، وتقييم مستوى الخدمات ومدى سرعة الاستجابة لها. كما تسعى المبادرة إلى توحيد الجهود وتسهيل التعاون بين جميع الأطراف لدعم جهود إعادة الإعمار وتحسين الخدمات، بما يخدم مصلحة المجتمع ويعزز مبادئ العدالة والشفافية.


            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              روابط سريعة
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
                  من نحن
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
                  أقسامنا
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
                  الشركاء
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
                  تواصل معنا
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              معلومات التواصل
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <a
                    href="tel:00970599366036"
                    className="text-gray-300 hover:text-[#f5a623] transition-colors"
                  >
                    036 366 599 970 00
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <a
                    href="mailto:info@example.com"
                    className="text-gray-300 hover:text-[#f5a623] transition-colors"
                  >
                    info@example.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    قطاع غزة - خانيونس <br />
                    قطاع غزة - مدينة غزة
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f5a623]">
              ساعات العمل
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">السبت - الخميس:</span>
                    <br />
                    8:00 ص - 6:00 م
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#f5a623] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">الجمعة:</span>
                    <br />
                    <span className="text-[#f5a623]">
                      مغلق - استراحة الأسبوع
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
              جميع الحقوق محفوظة © {currentYear} منصة سوا بنعمرها - غزة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
