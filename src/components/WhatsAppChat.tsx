import { MessageCircle } from "lucide-react";

interface WhatsAppChatProps {
  /** Can be a full URL (https://wa.me/..., https://wa.link/...) or a phone number like +4474... */
  whatsappLink?: string;
}

const toWhatsAppHref = (value?: string) => {
  const v = (value || "").trim();
  // Always open chat to the phone number using wa.me
  const phone = (v && !v.startsWith("http://") && !v.startsWith("https://")
    ? v
    : "+447426468550").replace(/[^0-9]/g, "");

  return `https://wa.me/${phone}`;
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
        // Try window.open first (works in many environments); if blocked, let the normal link open.
        const w = window.open(href, "_blank", "noopener,noreferrer");
        if (w) e.preventDefault();
      }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};
