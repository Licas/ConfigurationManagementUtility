wget  --post-file=register.json --header="Content-Type:application/json" http://localhost:5003/discovery/register --no-proxy

wget -X GET --header="Content-Type:application/json" http://localhost:5002/discovery/discover/Eke0BrUx --no-proxy
