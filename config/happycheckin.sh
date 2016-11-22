#!/bin/bash

myip=$(ifconfig wlan0 | grep "inet addr" | awk '{print $2}')
myhostname=$(hostname)
message=$(echo "$myhostname" "is vibrantly checking in from" "$myip")
curl -XPOST -H "Content-Type: application/json" http://xx/api/storehappydocument?pretty -d '{"happystatus":"above", "tags": "picheckin", "comment": "'"$message"'" }'

