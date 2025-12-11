# Hosting Guide for JewelAura

This guide explains how to host the JewelAura application on a Virtual Private Server (VPS) and configure a domain name.

## Do I need a Third Party? (Server Options)

Yes, typically you need a "Third Party" (Cloud Provider) to host a public website. Here is why and what your options are:

### Option 1: Cloud VPS (Recommended)

You rent a virtual computer from a provider.

- **Pros**: Always online, dedicated public IP, secure, cheap (~$4-6/month).
- **Providers**: DigitalOcean, Linode, AWS Lightsail, Hetzner.
- **Best for**: This Docker setup (`docker-compose`).

### Option 2: Platform as a Service (PaaS)

You just upload your code, and they handle the server.

- **Pros**: Very easy, no server management.
- **Cons**: Can be more expensive, might need configuration changes (removing `nginx` container and letting them handle routing).
- **Providers**: **Railway**, **Render**, **Heroku**.
- **Note**: If you choose this, you often don't need the `nginx` service in `docker-compose.yml`, as they provide their own load balancer.

### Option 3: Self-Hosting (Your own Computer)

You turn your current computer into a server.

- **Pros**: Free.
- **Cons**:
  - Your computer must stay **ON** 24/7.
  - You expose your home IP address (Security risk).
  - Complex setup (requires **Port Forwarding** on your router and **Dynamic DNS**).
- **Verdict**: Good for testing, bad for a real business website.

---

## Prerequisites

1. **Domain Name**: You need to purchase a domain name (e.g., `jewelaura.com`) from a registrar like Namecheap, GoDaddy, or Google Domains.
2. **Server (VPS)**: As per Option 1 above. A server with at least 2GB RAM is recommended for this stack.

## Step 1: Set up the VPS

1. **Create a VPS** (e.g., Ubuntu 22.04 LTS).
2. **SSH into your server**:

    ```bash
    ssh root@your_server_ip
    ```

3. **Install Docker and Docker Compose**:

    ```bash
    # Update package index
    sudo apt update
    
    # Install prerequisites
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Verify installation
    docker compose version
    ```

## Step 2: Deploy the Application

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/Ngwanatuka/JewelAura.git
    cd JewelAura
    ```

2. **Configure Environment Variables**:
    - Create/Edit `.env.prod`:

      ```bash
      nano .env.prod
      ```

    - Ensure it contains your production secrets:

      ```env
      PORT=5000
      MONGO_URL=mongodb://admin:password@mongodb:27017/jewelaura?authSource=admin
      JWT_SEC=your_strong_jwt_secret
      PASS_SEC=your_strong_pass_secret
      STRIPE_KEY=your_stripe_live_key
      ```

      *Note: If you want to use an external MongoDB (like Atlas), update `MONGO_URL` in `.env.prod` AND remove the `MONGO_URL` override in `docker-compose.prod.yml`.*

3. **Build and Run**:

    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```

    - `-d`: Runs in detached mode (background).
    - `--build`: Forces a rebuild of the images.

4. **Verify Status**:

    ```bash
    docker compose -f docker-compose.prod.yml ps
    ```

    You should see `frontend`, `backend`, `mongodb`, and `nginx` running.

## Step 3: Configure DNS

1. Log in to your Domain Registrar's dashboard.
2. Navigate to **DNS Management** or **Name Server Settings**.
3. Add an **A Record**:
    - **Type**: A
    - **Host/Name**: @ (or `www` if you want <www.yourdomain.com>)
    - **Value/Target**: Your VPS IP Address (e.g., `192.0.2.1`)
    - **TTL**: Automatic or 3600

4. Wait for propagation (can take up to 24 hours, but usually faster).

## Step 4: SSL (HTTPS)

The current setup runs on HTTP (port 80). For HTTPS, you can use Certbot with Nginx.

1. **Install Certbot**:

    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

    *Note: Since Nginx is running inside Docker, you might need a different approach, like using a reverse proxy on the host or a sidecar container like `certbot`.*

    **Simpler approach for Docker**:
    Use a tool like `Nginx Proxy Manager` or modify the `nginx` container to handle SSL certificates.

    For now, your site is accessible via `http://your-domain.com`.

## Troubleshooting

- **Logs**: Check logs if something fails.

  ```bash
  docker compose -f docker-compose.prod.yml logs -f
  ```

- **Rebuild**: If you change code, rebuild.

  ```bash
  git pull
  docker compose -f docker-compose.prod.yml up -d --build
  ```
