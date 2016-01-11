'use strict';

const fs = require('fs');
const _ = require('lodash')

console.time('entire process')

let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','))

let columnHeader = _.first(trafficData)
let columnData = _.rest(trafficData)

const parseData = (columnData, columnHeader) => {
  let parsedData = []
    for(let i = 0; i < columnData.length; i++){
    parsedData.push(_.zipObject(columnHeader, columnData[i]))
  }
  return parsedData
}

const columnCollection = (columnName) => {
  return _.pluck(parseData(columnData, columnHeader), columnName)
}

const columnCounter = (columnArray) => {
  return _.countBy(columnArray, (val) => { return val })
}

const filterByCount = (obj, lowVal) => {
  return _.pick(obj, (val, key) => { return val > lowVal })
}

const incidentAddresses = columnCollection('INCIDENT_ADDRESS')
const addressCollection = columnCounter(incidentAddresses)
const incidentNeighborhoods = columnCollection('NEIGHBORHOOD_ID')
const neighborhoodCollection = columnCounter(incidentNeighborhoods)
const topNeighborhoods = filterByCount(neighborhoodCollection, 2890);
const topAddresses = filterByCount(addressCollection, 300);

console.timeEnd('entire process')
console.log(topAddresses);
console.log(topNeighborhoods);
