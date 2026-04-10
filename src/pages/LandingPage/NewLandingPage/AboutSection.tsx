import { ClipboardList, ShieldCheck, Users, BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../../contexts/LanguageContext";

export function AboutSection() {
  const { t } = useLanguage();
  const features = [
    {
      icon: ClipboardList,
      title: t("features.damage.title"),
      description: t("features.damage.description"),
    },
    {
      icon: ShieldCheck,
      title: t("features.accuracy.title"),
      description: t("features.accuracy.description"),
    },
    {
      icon: Users,
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
    {
      icon: BarChart2,
      title: t("features.reports.title"),
      description: t("features.reports.description"),
    },
  ];
  return (
    <section id="about" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
            {t("AboutSection.title")}
          </h2>
          <div className="w-20 h-1 bg-[#4d9a33] mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <h2 className="inline-block font-bold text-[#047a35]">
              {t("AboutSection.name1")}
              <h2 className="inline-block text-[#e01722]">
                {t("AboutSection.name2")}
              </h2>
            </h2>
            {t("AboutSection.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4d9a33] rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
