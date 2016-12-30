# Azure IOT #

For my experiments I decided to explore the Azure IOT realm. I used the following components:

* [Azure IOT Hub](https://azure.microsoft.com/en-us/services/iot-hub/) to manage devices and collect data from devices
* [Azure Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/) for real time processing of the data the devices where sending and various Azure storage opitions to get some insight into the options.
* [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) to store environment data from the sensors

One really valuable resource to get going with the programming is to look at Microsoft's [Azure repo](https://github.com/Azure) on github. It is hard, almost impossible, to keep documentation and examples up-to-date in the fast moving world of clouds, but I found the examples and SDK's to be very valuable.

* [Azure IOT SDK](https://github.com/Azure/azure-iot-sdks)


## The round-trip - monidbread ##

A round trip in my setup would be "rpi device" -> IOT Hub -> Stream Analytics engine -> DocumentDB. I created a small routine to read documents (messages) as they where received by the IOT hub and ended up in the documentDB.

The `monidbread` project is part of the pienvironmentmonitor repository. Assuming that you have Azure eco-system running (with IOT Hub, Stream Analytics connected to a documentDB) on a system which have Node.js installed; do the following to get going (does not have to be the RPI):

* Clone the [pievironment](https://github.com/larskaare/pienvironmentmonitor.git) repository to your raspberry pi
* Change directory to `monidbread` and do a `npm install`
* Update `config/config.json`
  * Set "AZ_HOST_URL" to the url of you documentDB
  * Set "AZ_MASTER_KEY" to the key defined for the documentDB
  * Set "readInterval" to the period in millisecond (how often we pull the documentDB for changes)
* Start reading documents
  * `npm start`

At each `readInterval` the routine will list new documents/messages.

Browsing into [Azure-documentdb-node](https://github.com/Azure/azure-documentdb-node) would be a good place to continue exploring this path using Node.js.