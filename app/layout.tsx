import "./globals.css";

export const metadata = {
  title: "AI Interactive Story Builder",
  description: "Interactive story platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}