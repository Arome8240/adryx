# 🐳 Starting Docker

Before running Adryx with Docker, you need to start the Docker daemon.

## For Docker Desktop Users

### Linux
```bash
# Start Docker Desktop from your applications menu
# Or use systemctl if installed as a service
sudo systemctl start docker
```

### macOS
1. Open Docker Desktop from Applications
2. Wait for Docker to start (whale icon in menu bar)

### Windows
1. Open Docker Desktop from Start menu
2. Wait for Docker to start (whale icon in system tray)

## For Docker Engine Users (Linux)

```bash
# Start Docker daemon
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
```

## Verify Docker is Running

```bash
# Check Docker info
docker info

# Check Docker version
docker version

# Check Docker Compose
docker compose version
```

## Then Run Adryx

Once Docker is running:

```bash
# Option 1: Using Makefile
make docker-up

# Option 2: Using Docker Compose directly
docker compose up -d

# Option 3: Using helper script
./scripts/docker-start.sh
```

## Troubleshooting

### "Cannot connect to the Docker daemon"

This means Docker is not running. Start Docker Desktop or the Docker daemon:

```bash
# Linux
sudo systemctl start docker

# Check if running
docker info
```

### Permission Denied

If you get permission errors on Linux:

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, then verify
docker info
```

### Docker Desktop Not Starting

1. Check system requirements
2. Restart your computer
3. Reinstall Docker Desktop if needed
4. Check Docker Desktop logs for errors

## Alternative: Run Without Docker

If you prefer not to use Docker:

```bash
# Install PostgreSQL locally
sudo apt install postgresql  # Ubuntu/Debian
brew install postgresql      # macOS

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database
createdb adryx

# Run backend
cd apps/backend
pnpm install
pnpm start:dev

# Run frontend (in another terminal)
cd apps/frontend
pnpm install
pnpm dev
```

See [QUICKSTART.md](./QUICKSTART.md) for more details.
