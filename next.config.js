/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // better-sqlite3 é um módulo nativo: mantenha-o externo no bundle do servidor.
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

module.exports = nextConfig;
