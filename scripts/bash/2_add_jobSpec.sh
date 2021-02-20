#!/usr/bin/env bash
CL_URL="$1"
JOB_SPEC="$2"
COOKIE_FILE="cookiefile"
curl -i -X POST -H 'Content-Type: application/json' -d '{"email": "user@example.com", "password": "password"}' "$CL_URL/sessions" --cookie-jar $COOKIE_FILE
NODE_ADDRESS=$(curl --cookie $COOKIE_FILE --cookie-jar $COOKIE_FILE -i -X GET "$CL_URL/v2/user/balances" | sed -n 's|.*"id":"\([^"]*\)".*|\1|p')
echo $NODE_ADDRESS #> ../../build/node2.addr
  jobSpecPayload=$(cat $JOB_SPEC)
  echo -en "Posting...\n$jobSpecPayload\n"
  while true; do
    RESPONCE=$(curl -s -b $COOKIE_FILE -d "$jobSpecPayload" -X POST -H 'Content-Type: application/json' "$CL_URL/v2/specs")
    JOBID=$(echo $RESPONCE | jq -r '.data.id')
    [[ "$JOBID" == null ]] || break
    echo -n .
    sleep 5
  done
  echo -en "RESPONCE $RESPONCE\n"
  echo -en "\nJOBID $JOBID"
  echo " done!"