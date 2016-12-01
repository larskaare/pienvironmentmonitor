FROM node

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

