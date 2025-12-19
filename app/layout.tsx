import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatbotButton from "@/components/ChatbotButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="p-6">{children}</div>

        {/* Floating Chatbot Button */}
        <ChatbotButton />
      </body>
    </html>
  );
}
