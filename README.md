## Requirements
* Ubuntu 18.04 or later
* Docker
* Docker Compose

## Installation
### 1. Copy config.example.json to config.json
```json
{
  "directories": {
    "traefik.acme": {
      "path": "./data/traefik/acme",
      "permissions": 775
    },
    "traefik.log": {
      "path": "./log",
      "permissions": 775
    }
  },
  "values": {
    "domain": "xxx.xxx",
    "email": "xxx@xxx.xxx"
  },
  "show": {
    "tls": false
  }
}
```
### 2. Edit config.json
**domain** - domain name for traefik dashboard. Set traefik.localhost for example  
**email** - email for SSL certificates. Do not required on localhost  
**tls** - True if you want comment enable TLS and redirection on https. Use false on localhost.  

### 3. Copy config/.htpasswd.example to config/.htpasswd
```
123:$apr1$6IjtTIJg$U5MsY5q4ZZlAbAOjDgUvn/
```

### 4. Edit config/.htpasswd
Install apache2-utils for "htpasswd" command
```sh
sudo apt install apache2-utils -y
```

Use "htpasswd" command for password hashing
```sh
htpasswd -nb user password
```
```
user:$apr1$fm1I.8qI$d8Eek89T5o7PF9Gt8NuqF1
```

Paste password into a file.
```
123:$apr1$6IjtTIJg$U5MsY5q4ZZlAbAOjDgUvn/
user:$apr1$fm1I.8qI$d8Eek89T5o7PF9Gt8NuqF1
```

### 5. Run installation script
```sh
sh ./configurator.sh
```

### 4. Create docker network
```sh
docker network create web
```

### 5. Run
```sh
docker-compose up -d
```
