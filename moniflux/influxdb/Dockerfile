FROM influxdb:latest

RUN rm -r /etc/influxdb/influxdb.conf
COPY influxdb.conf /etc/influxdb

EXPOSE 8086
#EXPOSE 8083 
#EXPOSE 2003