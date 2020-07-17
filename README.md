## Requirements
* Ubuntu 18.04 or later
* Docker
* Docker Compose

## Installation
### 1. Copy config.example.json to config.json and edit
```json
{
  "directories": {
    "traefik.acme": {
      "path": "./xxx/data/traefik/acme",
      "permissions": 755
    },
    "traefik.log": {
      "path": "./xxx/log/traefik",
      "permissions": 755
    }
  },
  "values": {
    "whoami.domain": "xxx.xxx",
    "traefik.domain": "xxx.xxx",
    "email": "xxx@xxx.xxx",
    "tls": false
  }
}
```

### 2. Copy config/.htpasswd.example to config/.htpasswd
```
123:$apr1$6IjtTIJg$U5MsY5q4ZZlAbAOjDgUvn/
```

### 3. Edit config/.htpasswd
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

### 4. Run installation script
```sh
sh ./configurator.sh
```

### 5. Create docker network
```sh
docker network create web
```

### 6. Run
```sh
docker-compose up -d
```
