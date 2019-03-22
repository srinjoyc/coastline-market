import {
  FormattedOrders
} from '../collections/FormattedOrders.js'
import {
  Orders
} from '../collections/Orders.js'
import {
  Stats
} from '../collections/Stats.js'
import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from "meteor/accounts-base"
import {
  Email
} from 'meteor/email'
import { _ } from 'lodash'

var moment = require('moment');
let count = 0
let count2 = 0
const getDateFromStr = (dateStr) => {
    let timestampDate = new Date(dateStr);
    let month = timestampDate.getMonth();

    // let month = moment(dateStr, "dddd, MMMM Do, YYYY").month()
    // if(isNaN(month)){
    //   console.log("FCKED")
    //   console.log(month)
    //   console.log(dateStr)
    //   if (typeof(dateStr[0]) == 'undefined') {
    //     return 100
    //   }
    //   console.log("maybe less")
    //   console.log(month)
    //   console.log("=------==-==-==")
    // }
    // const year = moment(dateStr, "dddd, MMMM Do, YYYY").year()
    if (timestampDate.getFullYear() === 2018) {
      month += 12
    }
    if (timestampDate.getFullYear() === 2019) {
      month += 24
    }
    // console.log(month)
    // if(isNaN(month)){
    //   console.log(dateStr)
    //   console.log(month)
    // }
    return month
}
const getFormattedDate = (deliveryDate) => {
  let month = moment(deliveryDate, "dddd, MMMM Do, YYYY").month()
  // case 2 = 'August 25th 2017'
  if(isNaN(month)){
    month = moment(deliveryDate, "MMMM Do YYYY").month()
  }
  // case 4 = Tuesday September 18th 2017
  if(isNaN(month)){
    month = moment(deliveryDate, "dddd MMMM Do YYYY").month()
  }
  // case 5 = Friday, October 5th 2017
  // case 6 = Thursday, May 3rd, 2018
  if(isNaN(month)){
    month = moment(deliveryDate, "dddd, MMMM Do, YYYY").month()
  }
  return {
    day: moment(deliveryDate, "dddd, MMMM Do, YYYY").day(),
    month,
    year: moment(deliveryDate, "dddd, MMMM Do, YYYY").year()
  }
}
const getFormattedOrder = (order) => {
  let newOrders = []
  let { deliveryDate } = order
  let newDate = {}
    //TODO: go through all recurring orders.
  // is object = Tuesday, October 24th, 2017
  if(Array.isArray(deliveryDate)){
    count2 += 1
    const firstDateInOrder = deliveryDate[0].deliveryDate
    newDate = getFormattedDate(firstDateInOrder)
    newOrders.push({newDate, ...order })
    console.log("array")
    return newOrders
  }
  if(typeof(deliveryDate) === 'object'){
    count += 1
    return {}
  }
  // case 3 = 'Tuesday, September 12th, 2017'
  if(isNaN(newDate.month)){
    newDate = {
      day: moment(deliveryDate, "dddd, MMMM Do, YYYY").day(),
      month: moment(deliveryDate, "dddd, MMMM Do, YYYY").month(),
      year: moment(deliveryDate, "dddd, MMMM Do, YYYY").year()
    }
  }

  // case 1 = 'Invalid date' // malformed (only 1 order)
  if(deliveryDate === 'Invalid date' || deliveryDate === 'Tuesday, August 29th'
  || deliveryDate === 'Tuesday September 18th 2017' || order["deliveryNote"] === 'SAMPLE'
  || deliveryDate === 'Friday, October 5th 2017'
  || deliveryDate === 'Tuesday, October 24th' || deliveryDate === 'Friday, October 27th'
  || deliveryDate === 'Friday, November 10th' || deliveryDate === 'Friday, November 17th'
  || deliveryDate === '' || order['status'].toLowerCase() === 'cancelled') {
    count += 1
    return {}
  }
  newOrders.push({newDate, ...order })
  return newOrders
}
Meteor.methods({

  /**
   * @description Checks if the user's email exists.
   * @param {String} email
   * @returns {Boolean} If the user's email is available or not.
   */
   'stats.getOrders3' () {
    let orders = Orders.find({}).fetch()
    console.log(orders.length)
    orders = orders.filter(order => order.paid === true && order.status.toLowerCase() !== "cancelled")
    console.log(orders.length)
    let newOrders = []
    orders.map((order, idx) => {
      const formattedOrders = getFormattedOrder(order)
      // check if empty
      // if(Object.keys(formattedOrders).length === 0 && formattedOrders.constructor === Object){
      //   console.log(idx)
      // }
      if (Array.isArray(formattedOrders)) {
        newOrders = [...newOrders, ...formattedOrders]
      }
    })
    newOrders = newOrders.filter((order) => {
      return order !== "bad"
    })
    console.log("final len " + newOrders.length)
    console.log("empty " + count)
    console.log("reccuring: " + count2)
    console.log(Object.keys(newOrders))
    console.log(newOrders['2936'])
    return newOrders
   },
   'stats.getOrders' () {
    if(Meteor.isServer) {
      if(Meteor.userId() !== 'tNw5meMNLd3gwCZxE')
        return Meteor.Error("Not an admin or not logged in.")
      let stats = Stats.findOne({})
      return {
        revenueData: stats.revenue_data,
        customerData: stats.customer_data,
        productData: stats.product_data,
        currentData: stats.current_data,
        churnData: stats.churn_data,
        orderFrequencyData: stats.order_frequency_date,
        ltvData: stats.ltv_by_join_date,
        lastUpdated: stats.last_updated,
      }
    }
   }

  //  // random shit
  //  'stats.getOrders2' () {
  //    //Friday, January 20th, 2017
  //    let orders = Orders.find({}).fetch()
  //    orders = orders.filter(order => order.paid == true)
  //    orders = orders.map((order, idx) => {
  //      let formattedOrder = {}
  //      if (!('deliveryDate' in order)){
  //        return false
  //      }
  //      if(typeof(order.deliveryDate) === 'string') {
  //        formattedOrder = {month: getDateFromStr(order.timestamp), ...order}
  //      } else {
  //        return false
  //      }
  //      return formattedOrder
  //    })
  //    console.log(orders.length)
  //    orders = orders.filter((order) => {
  //       return !isNaN(order.month);
  //     });
  //   console.log(orders.length)
  //    const ordersByMonth = _.groupBy(orders, 'month')
  //    //console.log(ordersByMonth)
  //    let monthlyRevenues = []
  //    _.mapKeys(ordersByMonth, (order, month) => {
  //      let monthlyTotal = 0
  //      order.reduce((acc, order) => {
  //        if(typeof(order.total) === 'string') {
  //          order.total = parseInt(order.total)
  //        }
  //        if(order.month === 21) {
  //          console.log("order: " + order.total)
  //          console.log("acc: " + acc)
  //        }
  //        monthlyTotal += order.total
  //        return acc += order.total
  //      }, 0)
  //      monthlyRevenues.push(monthlyTotal)
  //    })
  //    console.log(monthlyRevenues)
  //    //console.log(total)
  //    return orders
  //  }
})
