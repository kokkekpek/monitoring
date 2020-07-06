## Requirements
* Ubuntu 18.04 or later
* Docker
* Docker Compose

## Installation
### 1. Copy sed.example.json to sed.json and edit

```json
{
  "domain": "traefik.domain.com",
  "email": "my.email@google.com",
  "comment.tls": "#"
}
```
**domain** - domain name for traefik dashboard. Set traefik.localhost for example  
**email** - email for SSL certificates. Do not required on localhost  
**comment.tls** - "#" or "". Place "#" if you want comment part of Traefik config, disable TLS and stop redirection on https. Use "#" localhost for example. Place empty string "" if you want use TLS and enable redirection on https.  

#### Note
sed.json used in installation process. Placeholders in template files replace on values from sed.json.  
  
traefik.template.yml
```yaml
acme:
  email: '{sed.email}'
```

sed.json
```json
{
    "email": "my.email@google.com"
}
```

Result in traefik.yml
```yaml
acme:
  email: "my.email@google.com",
```

### 2. Copy config/.htpasswd.example to config/.htpasswd and edit
Example:
```
test:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/
test2:$apr1$d9hr9HBB$4HxwgUir3HP4EsggP/QNo0
```

Install apache2-utils htpasswd command
```sh
sudo apt install apache2-utils -y
```

Use htpasswd command for password hashing
```sh
htpasswd -nb user password
```
```
user:$apr1$fm1I.8qI$d8Eek89T5o7PF9Gt8NuqF1
```

### 3. Run installation script
```sh
cd project/directory/
docker run -it --rm --name script -v "$PWD":/usr/src/app -w /usr/src/app node:14.5-alpine node install
```

### 4. Create external network
```sh
docker network create web
```

### 5. Run
```sh
docker-compose up -d
```
