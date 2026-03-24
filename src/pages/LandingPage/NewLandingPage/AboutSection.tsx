import { MapPin, Shield, Users, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: MapPin,
    title: 'موقع واحد',
    description: 'جميع المعدات في مكان واحد'
  },
  {
    icon: Shield,
    title: 'ضمان الجودة',
    description: 'معدات موثوقة ومعتمدة'
  },
  {
    icon: Users,
    title: 'خدمة عملاء',
    description: 'فريق متخصص لخدمتكم'
  },
  {
    icon: TrendingUp,
    title: 'تنظيم وتنوع',
    description: 'منتجات منظمة ومتنوعة'
  }
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">نبذة عن المنصة</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            يضم مركز المعدات الصناعية فعلياً محلات متخصصة تحت سقف واحد يضم تشكيلة من أي احتياج، 
            بيت تجميعي في تخصص واحد من مكان واحد، معا نجعل المركز واحدا تلبي احتياجات القطاع الصناعي المتنوع.
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5a623] rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
