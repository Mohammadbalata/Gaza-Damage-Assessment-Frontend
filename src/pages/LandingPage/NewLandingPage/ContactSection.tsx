import { useState } from "react";
import { Phone, Mail, MessageSquare, Send, User } from "lucide-react";
import { motion } from "motion/react";
import ContactInfo from "../../../components/ContactInfo";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // في التطبيق الحقيقي، سيتم إرسال البيانات إلى الخادم
    alert("شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      phone: "036 366 599 970 00",
      email: "info@ example.com",
      whatsapp: "036 366 599 970 00",
    },
    {
      phone: "036 366 599 970 00",
      email: "info@ example.com",
      whatsapp: "036 366 599 970 00",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 scroll-mt-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">تواصل معنا</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            نحن هنا للإجابة على استفساراتك ومساعدتك في اختيار المعدات المناسبة
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">
                معلومات التواصل :
              </h3>
              <div className="flex flex-col gap-5">
                {contactInfo.map((info, index) => (
                  <ContactInfo
                    key={index}
                    phone={info.phone}
                    email={info.email}
                    whatsapp={info.whatsapp}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#1e3a5f] text-white p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">ساعات الدوام</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>السبت - الخميس</span>
                  <span className="font-semibold">8:00 ص - 6:00 م</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>الجمعة</span>
                  <span className="font-semibold text-[#f5a623]">مغلق</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 54 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">
                أرسل رسالة
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    الاسم
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a623] focus:border-transparent outline-none transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a623] focus:border-transparent outline-none transition-all"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a623] focus:border-transparent outline-none transition-all"
                      placeholder="أدخل رقم هاتفك"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a623] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f5a623] hover:bg-[#d68f1a] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
