import { Providers } from "./providers";

export default function RootLayout({ children }: any) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}