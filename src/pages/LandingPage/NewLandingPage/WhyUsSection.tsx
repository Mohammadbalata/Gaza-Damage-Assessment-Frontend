import { CheckCircle, Award, Clock, HeartHandshake, Star, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    icon: CheckCircle,
    title: 'جودة مضمونة',
    description: 'نوفر منتجات عالية الجودة من علامات تجارية موثوقة'
  },
  {
    icon: Award,
    title: 'خبرة طويلة',
    description: 'أكثر من 10 سنوات في خدمة القطاع الصناعي'
  },
  {
    icon: Clock,
    title: 'توفير الوقت',
    description: 'كل ما تحتاجه في مكان واحد يوفر عليك الوقت والجهد'
  },
  {
    icon: HeartHandshake,
    title: 'خدمة متميزة',
    description: 'فريق متخصص لمساعدتك في اختيار المعدات المناسبة'
  },
  {
    icon: Star,
    title: 'تنوع هائل',
    description: '12 قسماً متخصصاً يغطي جميع احتياجاتك الصناعية'
  },
  {
    icon: ThumbsUp,
    title: 'أسعار تنافسية',
    description: 'أفضل الأسعار مع الحفاظ على الجودة العالية'
  }
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1e3a5f] to-[#2d5a8f] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">لماذا مركز المعدات الصناعية؟</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            نحن الخيار الأمثل لجميع احتياجاتك من المعدات والأدوات الصناعية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#f5a623] p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                    <p className="text-gray-200">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/10 backdrop-blur-sm px-8 py-6 rounded-lg">
            <p className="text-2xl font-bold text-[#f5a623] mb-2">
              "مكان واحد، معدات متنوعة"
            </p>
            <p className="text-lg text-gray-200">
              شعارنا الذي نلتزم به لخدمتكم بأفضل طريقة ممكنة
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
