import "./globals.css";

export const metadata = {
  title: "Production Cost Calculator",
  description: "Smart platform to manage and calculate production costs efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
