

# project site
https://junsaikogure.com/

## How to start
```
git clone https://github.com/zzaizzai/project-manage-nodejs-ts.git

npm install
npm start
```


## with Linux
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v18.17.0
```


## DataAcess Permission
```
ls -l db/database.db
sudo chmod 777 database.db
```


## SSL memo

```
sudo apt-get update
sudo apt-get install python3-certbot-nginx

sudo certbot --nginx
```

## SSL renew automation
```
sudo crontab -e
0 0 * * * sudo certbot renew --renew-hook="sudo service nginx restart"
```


## ubuntu update

```
cd /srv/projectdir
sudo git reset --hard HEAD
sudo git pull origin master
sudo pkill -f "node"
nohup npm start &
exit
```