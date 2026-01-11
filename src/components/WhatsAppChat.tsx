import { MessageCircle } from "lucide-react";

interface WhatsAppChatProps {
  whatsappLink?: string;
}

export const WhatsAppChat = ({ whatsappLink = "https://wa.link/xfpx1f" }: WhatsAppChatProps) => {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};
