import { 
  Wrench, 
  Hammer, 
  Drill, 
  Zap, 
  Cog, 
  Pickaxe,
  PaintBucket,
  Truck,
  Settings,
  Boxes,
  HardHat,
  Construction
} from 'lucide-react';
import { motion } from 'motion/react';

const departments = [
  { icon: Wrench, name: 'معدات كهربائية', color: '#f5a623' },
  { icon: Hammer, name: 'أدوات يدوية', color: '#f5a623' },
  { icon: Drill, name: 'معدات لحام', color: '#f5a623' },
  { icon: Zap, name: 'معدات كهرباء', color: '#f5a623' },
  { icon: Cog, name: 'معدات ميكانيكية', color: '#f5a623' },
  { icon: Pickaxe, name: 'معدات الحدادة', color: '#f5a623' },
  { icon: PaintBucket, name: 'معدات الدهان', color: '#f5a623' },
  { icon: Truck, name: 'معدات نقل', color: '#f5a623' },
  { icon: Settings, name: 'قطع غيار', color: '#f5a623' },
  { icon: Boxes, name: 'مواد البناء', color: '#f5a623' },
  { icon: HardHat, name: 'معدات السلامة', color: '#f5a623' },
  { icon: Construction, name: 'معدات البناء', color: '#f5a623' }
];

export function DepartmentsSection() {
  return (
    <section id="departments" className="py-20 bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">أقسام المركز</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            يضم المركز 12 قسماً متخصصاً .. كل قسم مستقل ومتخصص في مجال عمل محدد
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-center text-sm font-semibold">{dept.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
