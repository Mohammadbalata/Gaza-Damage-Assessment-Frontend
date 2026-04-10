import { motion } from "motion/react";
import { useLanguage } from "../../../contexts/LanguageContext";

const partners = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dopcli6un/image/upload/v1774688502/logo_lx9vn3.jpg",
    title: " بلدية خانيونس",
  },
];

export function PartnersSection() {
  const { t } = useLanguage();
  return (
    <section id="partners" className="py-20 bg-gray-200 scroll-mt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
            {t("PartnersSection.title")}
          </h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t("PartnersSection.description")}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-stretch gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 w-48"
            >
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src={partner.url}
                  alt={partner.title}
                  className="w-full h-full object-contain group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
