import {
  Stats
} from '../collections/Stats.js'
import {
  Meteor
} from 'meteor/meteor'

Meteor.methods({
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
})
