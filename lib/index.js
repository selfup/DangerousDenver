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

function columnCollection = (columnName) => {
  return _.pluck(parseData(columnData, columnHeader), columnName)
}

const columnCounter = (columnArray) => {
  return _.countBy(columnArray, (value) => {
    return value
  })
}

const filterByCount = (object, leastValue) => {
  return _.pick(object, (value, key) => {return value > leastValue})
}

const addresses = columnArray('INCIDENT_ADDRESS')
const addressCount = columnCounter(addresses)
const neighborhoods = columnArray('NEIGHBORHOOD_ID')
const neighborhoodCount = columnCounter(neighborhoods)

console.timeEnd('entire process')
