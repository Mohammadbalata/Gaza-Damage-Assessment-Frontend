import { Phone, Mail, MessageSquare } from "lucide-react";

const ContactInfo = ({
  phone,
  email,
  whatsapp,
}: {
  phone: string;
  email: string;
  whatsapp: string;
}) => {
  return (
    <div className=" bg-white rounded-lg">
      <div className="flex items-center gap-4 p-2  ">
        <div className="bg-[#f5a623] p-3 rounded-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">الهاتف</p>
          <a
            href="tel:00970599366036"
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
          >
            {phone}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 p-2 ">
        <div className="bg-[#f5a623] p-3 rounded-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">البريد الإلكتروني</p>
          <a
            href="mailto:info@example.com"
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
          >
            {email}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 p-2 ">
        <div className="bg-[#f5a623] p-3 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">واتساب</p>
          <a
            href="https://wa.me/970599366036"
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
          >
            {whatsapp}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
