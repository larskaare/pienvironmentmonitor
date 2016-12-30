# Moni #

Moni is the software component for collection sensor data. It is a Node.js system using Python to talk to the physical sensors. Why not talk to the sensors using Node.js? A good questions! Experimenting and testing I found the robustness of the Python code to be far more robust and supportive when working with the RPI GPIO. No need to re-invent the wheel.

## Installing & Running ##

(Assuming the Node.js and Python is available on the RPi)

* Clone the [pievironment](https://github.com/larskaare/pienvironmentmonitor.git) repository to your rpi.
* Install [Tentacle PI](https://github.com/lexruee/tentacle_pi) to add support for the TSL2561 sensor. Follow the install instructions in the link. Remember to enable [I2C support](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c) in RPI.
* Change directory to "moni" and do a `npm install`
* Make sure you have an Azure IOT Hub defined.
  * Make a note of the hub connection sting ("Shared access policies->"Policy"->"Connection string - primary key"). It goes into config "IOTHUB_CONNSTRING"
  * Make a note of the hub hostname. It goes into config "HUB_HOSTNAME"
* Update `config/config.json`
  * Set "MockPi" to "False" for reading sensors. Setting to "False" generates random values
  * Set "DeviceID" to a relevant device name - like "Envmonitor1"
  * Set "HubSendInterval" to define how often the device sends sensor data to the hub (milliseconds)
* Create device identity at the hub
  * `npm run-script createdevice`
  * Hope for success and make a note of the "PrimaryKey"
  * Update config/config.json "DEVICE_KEY" with value from PrimaryKey
* Start sending messages with sensordata to the hub
  * `npm start`

## Key components ##

* `config/config.json` (holding configuration information)
  * Configuration variables are read from the commandline argument, environment variables and then the `config.json` - with presedence in that order. I do not recommend storing keys and secrets in the `config.json` file. Rather use a local file with environment vaiables (like local_env) - and keep the file out of git).
  * `MockPi`: If set to false it will use the physcial sensors. If set to true it will simulate the sensors.
  * `DeviceID`: The device id - name
  * `Device location`: Optional information that will follow the sensor data
  * `HubSendInterval`: Intervall in milliseconds for sending messages to the Azure IOT Hub
  * `IOTHUB_CONNSTRING`: The connection string found in your Azure set-up
  * `DEVICE_KEY`: The device key generated by Azure to uniquly identify one device
  * 'SendToInfluxDB`: Used by the `monitofluxdb` routine to drive the capture of messages going onto the IOT hub and storing them in an InFlux database.
  * `Influx_host`: The name of the host holding the Influx database
  * `Influx_db`: The name of the database in InfluxDB where to store messages
* `lib/js/sensorworker.js`. This is where the sensor magic happens. Update this part of the system to reflect what sensors you are using and how you pack the data into a message. Use the `sensorData` function to define you values and the `readSensors` function to do sensor magic

## Environment data  - messages ##

Messages are usually captured and send in JSON format using the following format:
~~~~
{
     "temperature": "",
     "barometicPressure": ""
     "humidityP": "",
     "lux": "",
     "deviceID": "",
     "deviceLocation": "",
     "deviceTimeStamp": ""
}
~~~~

## Other nice to know stuff ##

* The `package.json` file contains a few scripts
  * `start` which runs the main program
  * `createdevice` which connects to a Azure IOT Hub and created/gets and device key
  * `monitoflux´ which runs the routine that captures environment messages from the IOT hub and stores them in a defined InfluxDB
* If [Grunt](http://gruntjs.com) is available inspect the `gruntfile.js` for available task (like watch, linting, test and beautifier)
* The `Dockerfile` can be used to pack moni into a docker container. Especially useful for simulating devices. Comment/un-comment the `FROM` statements to indicate your architecture.