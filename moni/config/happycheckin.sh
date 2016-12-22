#!/bin/bash

sleep 10;  # Waiting and hoping for a valid IP adddress

if [ "$IFACE" =  wlan0 ]; then
  myip=$(ifconfig wlan0 | grep "inet addr" | awk '{print $2}')
  myhostname=$(hostname)
  message=$(echo "$myhostname" "is vibrantly checking in from" "$myip")
  curl -XPOST -H "Content-Type: application/json" http://???/api/storehappydocument?pretty -d '{"happystatus":"above", "tags": "pich
eckin", "comment": "'"$message"'" }'
fi
