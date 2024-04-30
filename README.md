

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