import { ClipboardList, ShieldCheck, Users, BarChart2 } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: ClipboardList,
    title: "تسجيل الأضرار",
    description: "توثيق شامل لجميع الأضرار في مكان واحد",
  },
  {
    icon: ShieldCheck,
    title: "دقة وموثوقية",
    description: "بيانات موثّقة ومعتمدة رسمياً",
  },
  {
    icon: Users,
    title: "دعم المتضررين",
    description: "فريق متخصص لمساعدتكم في كل خطوة",
  },
  {
    icon: BarChart2,
    title: "تقارير وإحصاءات",
    description: "تحليل شامل لحجم الأضرار المرصودة",
  },
];

export function AboutSection() {
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
            نبذة عن المنصة
          </h2>
          <div className="w-20 h-1 bg-[#4d9a33] mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          هي مبادرة شبابية مستقلة، بعيدة عن التجاذبات السياسية والفئوية، تهدف إلى جمع جهود المواطنين والجهات العاملة والمانحين في إطار واحد يخدم المجتمع، ويعزز المشاركة المجتمعية من خلال توفير منصة شفافة تتيح للمواطنين متابعة الخدمات، والإبلاغ عن احتياجاتهم، والتواصل المباشر مع الجهات المعنية، وتقييم مستوى الخدمات ومدى سرعة الاستجابة لها. كما تسعى المبادرة إلى توحيد الجهود وتسهيل التعاون بين جميع الأطراف لدعم جهود إعادة الإعمار وتحسين الخدمات، بما يخدم مصلحة المجتمع ويعزز مبادئ العدالة والشفاف
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
