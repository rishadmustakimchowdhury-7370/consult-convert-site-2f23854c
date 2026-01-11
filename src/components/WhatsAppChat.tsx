import { MessageCircle } from "lucide-react";

interface WhatsAppChatProps {
  /** Can be a full URL (https://wa.me/..., https://wa.link/...) or a phone number like +4474... */
  whatsappLink?: string;
}

const toWhatsAppHref = (value?: string) => {
  // Always open chat to the phone number (works across more devices/browsers than wa.me in some cases)
  const v = (value || "").trim();
  const phone = (v && !v.startsWith("http://") && !v.startsWith("https://")
    ? v
    : "+447426468550").replace(/[^0-9]/g, "");

  return `https://api.whatsapp.com/send?phone=${phone}`;
};

export const WhatsAppChat = ({
  whatsappLink = "https://wa.me/447426468550",
}: WhatsAppChatProps) => {
  const href = toWhatsAppHref(whatsappLink);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // In some embedded previews, navigating inside the iframe gets blocked by WhatsApp (X-Frame-Options).
        // Force a real new tab/window instead.
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};
