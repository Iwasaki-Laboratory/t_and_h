/** @type {import('next').NextConfig} */
//const nextConfig = {};

//export default nextConfig;

const nextConfig = {
  experimental: {
    swcMinify: true, // SWCのミニファイ設定を有効にする
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /node_modules/, // ここでnode_modulesを除外することで、不要な処理を避ける
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });
    return config;
  },
};

export default nextConfig;