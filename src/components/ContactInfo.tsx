import { WhatsApp } from "@mui/icons-material";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactInfo = ({
  phone,
  email,
  whatsapp,
  address,
}: {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
}) => {
  return (
    <div className="bg-white rounded-lg  ">

        <div className="flex items-center gap-4 p-2  ">
        <div className="bg-[#f5a623] p-3 rounded-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">الهاتف</p>
          <a
            href={`tel:${phone}`}
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
            target="_blank"
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
            href={`mailto:${email}`}
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
            target="_blank"
          >
            {email}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 p-2 ">
        <div className="bg-[#f5a623] p-3 rounded-lg">
          <WhatsApp className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">واتساب</p>
          <a
            href={`https://wa.me/${whatsapp}`}
            className="text-lg font-semibold text-[#1e3a5f] hover:text-[#f5a623]"
            target="_blank"
          >
            {whatsapp}
          </a>
        </div>
         
      </div>
      <div className="flex items-center gap-4 p-2">
<div className="bg-[#f5a623] p-3 rounded-lg">
          <MapPin className="w-6 h-6 text-white" />
        </div>
                            <div>
                    <p className="text-lg font-semibold text-[#1e3a5f] ">
                      {address}
                    </p>
                  </div>
</div>
    </div>

  );
};

export default ContactInfo;
