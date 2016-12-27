FROM node

RUN mkdir -p /usr/src/
WORKDIR /usr/src

RUN git clone https://github.com/larskaare/pienvironmentmonitor.git
WORKDIR /usr/src/pienvironmentmonitor/moni

RUN npm install

ENV IOTHUB_CONNSTRING=""
ENV SendToInfluxDB="true"
ENV Influx_host="localhost"
ENV Influx_db="environment_data"

CMD ["npm","run-script","monitoinfluxdb"]

#Typical run command
#docker run -d -e "IOTHUB_CONNSTRING=<>"
