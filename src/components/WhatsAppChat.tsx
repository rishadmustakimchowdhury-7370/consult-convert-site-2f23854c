import { MessageCircle } from "lucide-react";

interface WhatsAppChatProps {
  /** Can be a full URL (https://wa.me/..., https://wa.link/...) or a phone number like +4474... */
  whatsappLink?: string;
}

const toWhatsAppHref = (value?: string) => {
  const v = (value || "").trim();
  if (!v) return "https://wa.me/447426468550";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const phone = v.replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}`;
};

export const WhatsAppChat = ({
  whatsappLink = "https://wa.me/447426468550",
}: WhatsAppChatProps) => {
  return (
    <a
      href={toWhatsAppHref(whatsappLink)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};
