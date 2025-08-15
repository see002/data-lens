import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Add more remotePatterns here as needed
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-switch",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
      "@monaco-editor/react",
      "monaco-editor",
      "@tanstack/react-table",
      "@tanstack/react-virtual",
      "sonner",
      "zustand",
    ],
    cssChunking: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          // 1. Force HTTPS for all connections
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // 2. Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // 3. Control how much referrer info is sent
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // 4. Restrict browser features/APIs
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), fullscreen=(self)",
          },

          // 5. Content Security Policy (CSP)
          // Allows Monaco from jsDelivr and needed worker/blob sources
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: blob:",
              "font-src 'self' data: https://cdn.jsdelivr.net",
              "connect-src 'self'",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "manifest-src 'self'",
            ].join("; "),
          },

          // 6. Prevent embedding in iframes (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },

          // 7. Stronger isolation against cross-origin attacks
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

          // 8. Control cross-origin loading of your resources
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },

          // 9. Enforce that all cross-origin resources explicitly grant permission
          // Use credentialless to reduce breakage with third-party CDNs like jsdelivr
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
