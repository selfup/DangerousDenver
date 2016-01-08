'use strict'
const fs = require('fs')
const _ = require('lodash')

console.time('entire process')
let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','))

let columnHeader = _.first(trafficData)
let columnData = _.rest(trafficData)


const objectifyIt = (columnData, columnHeader) => {
  let parsedData = []
    for(let i = 0; i < columnData.length; i++){
    parsedData.push(_.zipObject(columnHeader, columnData[i]))
  }
  return parsedData
}

let addresses = _.pluck(objectifyIt(columnData, columnHeader), 'INCIDENT_ADDRESS')

let addressCount = _.countBy(addresses, function(address) {
 return address
})

let addressOrder = {}

let addresses = _.map(addressCount, function(value, address) {
 return addressOrder[value] = address;
})

console.timeEnd('entire process')

console.log(addressOrder);
