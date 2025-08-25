module.exports = {
  apps: [
    {
      name: "insta-backend",
      cwd: "./backend",
      script: "npm",
      args: "run dev",
      env: { NODE_ENV: "development" },
      env_production: { NODE_ENV: "production" },
      autorestart: true,
      max_restarts: 5,
      time: true
    },
    {
      name: "insta-frontend",
      cwd: "./frontend",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        // atau pakai .env.local di frontend
        NEXT_PUBLIC_API_URL: "http://localhost:4001"
      },
      env_production: { NODE_ENV: "production", PORT: 3000 },
      autorestart: true,
      max_restarts: 5,
      time: true
    }
  ]
}
