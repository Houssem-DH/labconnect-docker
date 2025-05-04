# Project Setup

This document provides all the instructions to install and run the Laravel application locally using Docker Compose.

## Prerequisites

* **Docker** (version ≥ 20.10)
* **Docker Compose** (version ≥ 2.0)
* *Optional*: **Node.js** & **npm** (for building front-end assets)

> ⚙️ Make sure Docker and Docker Compose are installed and running on your machine.

## 1. Clone the repository

```bash
# Replace with your repository URL
git clone https://github.com/Houssem-DH/labconnect-docker
cd labconnect-docker
```


## 2. Start the containers

```bash
# From the project root directory
docker compose up -d --build
```

> This command will:
>
> * Build the Docker images for the `app` and `db` services
> * Launch the containers in detached mode
> * Create the Docker network `app-network`



## 63. Access the application

Open your browser and navigate to:

```
http://localhost:8080
```

To test via cURL:

```bash
curl -v http://127.0.0.1:8080
```


