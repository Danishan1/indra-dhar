import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ToastProvider } from "@/components/common/";

export const metadata = {
  title: "Production Cost Calculator",
  description:
    "Smart platform to manage and calculate production costs efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
