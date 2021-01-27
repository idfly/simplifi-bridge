curl -i -X POST -H 'Content-Type: application/json' -d '{"email": "user@example.com", "password": "password"}' http://localhost:6689/sessions --cookie-jar cookie.txt
NODE_ADDRESS=$(curl --cookie cookie.txt --cookie-jar cookie.txt -i -X GET http://localhost:6689/v2/user/balances | sed -n 's|.*"id":"\([^"]*\)".*|\1|p')
echo $NODE_ADDRESS > ./build/node2.addr