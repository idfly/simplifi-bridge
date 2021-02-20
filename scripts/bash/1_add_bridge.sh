#!/usr/bin/env bash

CL_URL="$1"
ADAPER_URL="$2"
ADAPER_TYPE="$3"
COOKIE_FILE="cookiefile"
curl -i -X POST -H 'Content-Type: application/json' -d '{"email": "user@example.com", "password": "password"}' "$CL_URL/sessions" --cookie-jar $COOKIE_FILE
  payload=$(
    cat <<EOF
{
    "name": "$ADAPER_TYPE",
    "url": "$ADAPER_URL",
    "minimumContractPayment": "0",
     "confirmations": 0
}
EOF
  )

#echo "payload ${payload}"
#echo "curl -s -b $COOKIE_FILE -d \"$payload\" -X POST -H \'Content-Type: application/json\' \"$CL_URL/v2/bridge_types\" --write-out \'%{http_code}\' &>/dev/null"
#cat $COOKIE_FILE
RESPONCE=$(curl --cookie $COOKIE_FILE --cookie-jar $COOKIE_FILE -d "$payload" -X POST -H "Content-Type: application/json" "$CL_URL/v2/bridge_types" --write-out "%{http_code}")
if [[ $RESPONCE == *"200"* ]]; then
  echo "External Adapter has been added to Chainlink node"
else
  echo $RESPONCE
fi

