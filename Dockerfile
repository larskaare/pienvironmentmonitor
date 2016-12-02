#FROM node

#Arm version
FROM hypriot/rpi-node

RUN mkdir -p /usr/src/
WORKDIR /usr/src

RUN git clone https://github.com/larskaare/pienvironmentmonitor.git
WORKDIR /usr/src/pienvironmentmonitor

RUN npm install

ENV IOTHUB_CONNSTRING=""
ENV DEVICE_KEY=""
ENV HUB_HOSTNAME=""
ENV MockPi="true"
ENV DeviceID=""
ENV DeviceLocation="container"
ENV HubSendInterval="1000"

CMD ["npm","start"]

#Typical run command
#docker run -d -e "IOTHUB_CONNSTRING=<>" \
#    -e "DEVICE_KEY=<>" \
#    -e "HUB_HOSTNAME=<>" \
#    -e "DeviceID=<>" \
#    -e "DeviceLocation=dockersim" \
#    -e "HubSendInterval=500" \
#    envmonisim
