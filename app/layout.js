import "./globals.css";
import StudioLauncher from "./StudioLauncher";

export const metadata = {
  title: "PREVIEW",
  description: "Visualize pisos e revestimentos antes de decidir."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}<StudioLauncher /></body>
    </html>
  );
}
