import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ToastProvider } from "@/components/common/";
import RouteGuard from "@/components/common/jsx/RouteGuard";

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
          <AuthProvider>
            <RouteGuard>{children}</RouteGuard>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
