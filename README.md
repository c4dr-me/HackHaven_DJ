# 📦 HTTPS Setup Guide for Local Development

This guide walks you through setting up HTTPS for your local development environment using custom certificates, **Nginx**, and **XAMPP**.

---

## 🛡️ Certificate Installation

### 📱 Mobile (Android)

1. Locate the `rootCa.cert` inside the root directory of the **client** folder.
2. Open **Settings** → **Security** → **Install Certificate**.
3. Select **Drive** or file manager and choose `rootCa.cert`.

### 🖥️ Desktop (Windows)

1. Double-click on `rootCa.cert`.
2. Choose **Local Machine** (not Current User).
3. Select **Place all certificates in the following store**.
4. Choose **Trusted Root Certification Authorities**.
5. Click **Finish** and confirm installation.

---

## 🚀 Nginx Configuration

### 📥 Install Nginx

- Download and extract [Nginx for Windows](https://nginx.org/en/download.html).
- Navigate to: `C:\nginx\conf`
- Create a folder named `certs`
- Place your `server.key` and `server.crt` inside `certs`.

### 🛠️ Update `nginx.conf`

Replace the content of `nginx.conf` with:

```nginx
#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       443 ssl;
        server_name  acdhemtos.duckdns.org;

        ssl_certificate      certs/server.crt;
        ssl_certificate_key  certs/server.key;

        location / {
            proxy_pass http://localhost:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name localhost;
        return 301 https://$host$request_uri;
    }
}
```
---

# 🪰 3. Install XAMPP
Download and install XAMPP

Open XAMPP Control Panel

Start MySQL and Apache (PHP)

# 📆 4. Set Up Client
```💾 Install Dependencies:
cd client
npm install
🧪 Create .env file in client:
VITE_API_BASE_URL=proxy
VITE_HTTPS=true
VITE_SSL_CRT_FILE=C:/xampp/htdocs/client/server.crt
VITE_SSL_KEY_FILE=C:/xampp/htdocs/client/server.key
VITE_PORT=5173
```
---
📂 5. Move Files
Place all project files (including the client folder) into the htdocs directory of XAMPP:

C:/xampp/htdocs/
# ✅ Access Over HTTPS
You can now access the project securely via:

https://acdhemtos.duckdns.org
Make sure Nginx is running to handle HTTPS requests and proxy to Vite.

