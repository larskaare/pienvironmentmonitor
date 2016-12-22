import bme280
from tentacle_pi.TSL2561 import TSL2561
import sys,time,json

sensorData = {'temperature': '','barometicPressure': '','humidityP': '0','lux': '0'}

#Setting up the tsl sensor
tsl = TSL2561(0x39,"/dev/i2c-1")
tsl.enable_autogain()
tsl.set_time(0x00)

#Reading data
data = bme280.readBME280All()
lux = tsl.lux()

sensorData['temperature'] = data[0]
sensorData['barometicPressure'] = data[1]
sensorData['humidityP'] = data[2]
sensorData['lux'] = lux

#print sensorData
print json.dumps(sensorData)