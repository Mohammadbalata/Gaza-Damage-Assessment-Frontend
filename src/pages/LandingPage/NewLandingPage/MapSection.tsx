import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";

export function MapSection() {
  return (
    <section id="map" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">موقعنا</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            نحن في خدمتكم في موقع استراتيجي بمدينة جدة
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-[#f5a623] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                    العنوان
                  </h3>
                  <p className="text-gray-700">
                    المنطقة الصناعية - الشعبة
                    <br />
                    جدة - المملكة العربية السعودية
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-[#f5a623] p-3 rounded-lg">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                    كيفية الوصول
                  </h3>
                  <p className="text-gray-700 mb-4">
                    يقع المركز في قلب المنطقة الصناعية بجدة، ويمكن الوصول إليه
                    بسهولة عبر الطرق الرئيسية
                  </p>
                  <a
                    href="https://maps.google.com/?q=21.543333,39.172778"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d68f1a] text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>افتح في خرائط جوجل</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#1e3a5f] text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                  <span>السبت - الخميس</span>
                  <span className="font-semibold">8:00 ص - 6:00 م</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>الجمعة</span>
                  <span className="font-semibold text-[#f5a623]">
                    مغلق - استراحة الأسبوع
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-[500px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.736789!2d39.172778!3d21.543333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMyJzM2LjAiTiAzOcKwMTAnMjIuMCJF!5e0!3m2!1sar!2ssa!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مركز المعدات الصناعية"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
