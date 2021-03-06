import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { dashboardPanelChart } from './../components/stats/charts.jsx'
import { Line, Bar } from "react-chartjs-2"

export default class StatsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      revenueData: null,
      customerData: null,
      productData: null,
      currentData: null,
      orderFrequencyData: null,
      ltvData: null,
      churnData: null,
      lastUpdated: null,
    }
    // all the fields needed to create a new user
    this.displayUserList = this.displayUserList.bind(this)
    this.displayCards = this.displayCards.bind(this)
    this.displayCustomers = this.displayCustomers.bind(this)
  }

  componentDidMount() {
    Meteor.call("stats.getOrders", (err, stats) => {
        if(err)
            console.log(err)
        if(stats)
            console.log(stats)
            this.setState({
              ...stats,
              dataReady: true,
            })
    })
  }
  displayCustomers() {
    const { customerData } = this.state
    return(
      <div className="col-md-8 offset-md-2 col-12 mt-5">
        <h2> Customer Leaderboard </h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Rank ($)</th>
              <th scope="col">Name</th>
              <th scope="col">First Order Month (m/y)</th>
              <th scope="col">Last Order Month (m/y)</th>
              <th scope="col">Total Orders (#)</th>
              <th scope="col">Avg Basket ($)</th>
              <th scope="col">LTV ($)</th>
              <th scope="col">Last Invoice Id</th>
            </tr>
          </thead>
          <tbody>
          {customerData.customers.map((customer, idx) => {
            return(
              <tr>
                <th scope="row">{idx + 1}</th>
                <td>{customer.name}</td>
                <td>{customer.firstSalesMonth}/{customer.firstSalesYear}</td>
                <td>{customer.lastSalesMonth}/{customer.lastSalesYear}</td>
                <td>{customer.totalNumberOfOrders}</td>
                <td>{Math.round(customer.avgBasketSize).toLocaleString('en')}</td>
                <td>{Math.round(customer.totalSpend).toLocaleString('en')}</td>
                <td>{customer.lastInvoiceId}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    )
  }
  displayProducts() {
    let { productData } = this.state
    productData = productData.slice(0, 50)
    return(
      <div className="col-md-8 offset-md-2 col-12 mt-5">
        <h2> Product Leaderboard </h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Rank (#)</th>
              <th scope="col">Name</th>
              <th scope="col"># of Orders</th>
              <th scope="col">GMV</th>
            </tr>
          </thead>
          <tbody>
          {productData.map((product, idx) => {
            return(
              <tr>
                <th scope="row">{idx + 1}</th>
                <td>{product['_id'].name}</td>
                <td>{product.total}</td>
                <td>{product.gmv.toLocaleString('en')}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    )
  }
  displayCards(){
    const { customerData, revenueData, lastUpdated } = this.state
    let totalRevenue = revenueData.revenues.reduce((acc, rev) => {
      return acc += rev
    }, 0)
    totalRevenue = Math.round(totalRevenue).toLocaleString('en')
    return (
      <div className="col-md-8 offset-md-2 col-12">
        <div className="row">
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <h4 className="card-title">$ {Math.round(customerData.avg_basket_overall)}</h4>
                <p className="card-text">Avg. Basket</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <h4 className="card-title"># {Math.round(customerData.avg_total_orders)}</h4>
                <p className="card-text"> Avg. Orders/Customer</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <h4 className="card-title">$ {Math.round(customerData.avg_total_spend)}</h4>
                <p className="card-text">Average LTV</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <h4 className="card-title"># {Math.round(customerData.num_customers)}</h4>
                <p className="card-text">Total Customers</p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <h4 className="card-title">$ {totalRevenue}</h4>
                <p className="card-text">Total Revenue</p>
                <p className="card-text"> <strong> Last Updated:  </strong>  {lastUpdated.toString()} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  displayCurrentCards(){
    const { currentData } = this.state
    return (
      <div className="col-md-8 offset-md-2 col-12">
        <div className="row">
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <small> Total Spend </small>
                <h4 className="card-title">$ {Math.round(currentData.current_gmv.totalSpend)}</h4>
                <small> Avg. Basket </small>
                <h4 className="card-title">$ {Math.round(currentData.current_gmv.avgBasketSize)}</h4>
                <small> # of orders </small>
                <h4 className="card-title"># {Math.round(currentData.current_gmv.totalNumberOfOrders)}</h4>
                <p className="card-text">This Month</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <small> Total Spend </small>
                <h4 className="card-title">$ {Math.round(currentData.past_month_gmv.totalSpend)}</h4>
                <small> Avg. Basket </small>
                <h4 className="card-title">$ {Math.round(currentData.past_month_gmv.avgBasketSize)}</h4>
                <small> # of orders </small>
                <h4 className="card-title"># {Math.round(currentData.past_month_gmv.totalNumberOfOrders)}</h4>
                <p className="card-text">Last Month</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <small> Total Spend </small>
                <h4 className="card-title">$ {Math.round(currentData['2018_gmv'].totalSpend)}</h4>
                <small> Avg. Basket </small>
                <h4 className="card-title">$ {Math.round(currentData['2018_gmv'].avgBasketSize)}</h4>
                <small> # of orders </small>
                <h4 className="card-title"># {Math.round(currentData['2018_gmv'].totalNumberOfOrders)}</h4>
                <p className="card-text">2018 Month</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <small> Up From Last Year</small>
                <h4 className="card-title">{Math.round(currentData['up_from_last_year_percent'])} % </h4>
                <small> Up From Last Month </small>
                <h4 className="card-title">{Math.round(currentData['up_from_last_month_percent'])} %</h4>
                <small> Target GMV </small>
                <h4 className="card-title">$ {Math.round(currentData['target_gmv'])}</h4>
                <small> % to Target</small>
                <h4 className="card-title"> {Math.round(currentData['percent_to_target'])} %</h4>
                <p className="card-text">Target Stats</p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card mt-2 mb-2">
              <div className="card-body">
                <small> This Week GMV </small>
                <h4 className="card-title">$ {Math.round(currentData['week_gmv']['totalSpend']).toLocaleString('en')}</h4>
                <small> Last Week GMV </small>
                <h4 className="card-title">$ {Math.round(currentData['past_week_gmv']['totalSpend']).toLocaleString('en')}</h4>
                <small> This Week Total Orders </small>
                <h4 className="card-title">{Math.round(currentData['week_gmv']['totalNumberOfOrders'])}</h4>
                <small> Last Week Total Orders </small>
                <h4 className="card-title"> {Math.round(currentData['past_week_gmv']['totalNumberOfOrders'])} </h4>
                <p className="card-text">Weekly Stats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  displayUserList(){
    const { revenueData, customerData, churnData, orderFrequencyData, ltvData } = this.state
    console.log(revenueData)
    const revenueGraphData = {
      labels: revenueData.months,
      datasets: [
        {
          label: 'Total Revenue By Month',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: revenueData.revenues
        }
      ]
    };
    // deep copy
    // # of orders by month
    let totalOrdersGraph = JSON.parse(JSON.stringify(revenueGraphData));
    totalOrdersGraph.datasets[0].data = revenueData.total_orders
    totalOrdersGraph.datasets[0].label = "Total # of Orders By Month"
    // avg order size by month
    let orderSizeGraph = JSON.parse(JSON.stringify(revenueGraphData));
    orderSizeGraph.datasets[0].data = revenueData.avg_order_size
    orderSizeGraph.datasets[0].label = "Average Order Size ($) by Month"
    // active customers
    let activeCustomerGraph = JSON.parse(JSON.stringify(revenueGraphData));
    activeCustomerGraph.datasets[0].data = churnData.active_customers
    activeCustomerGraph.datasets[0].label = "Active Customers (ordered last month and this month)"

    // new customers
    let newCustomerGraph = JSON.parse(JSON.stringify(revenueGraphData));
    newCustomerGraph.datasets[0].data = churnData.new_customers_by_month
    newCustomerGraph.datasets[0].label = "First Time Orders (New Customers)"
    // new customers
    let churnGraph = JSON.parse(JSON.stringify(revenueGraphData));
    churnGraph.datasets[0].data = churnData.churn_by_month
    churnGraph.datasets[0].label = "Churn % by Month"
    // order percentage
    let orderPercentageGraph = JSON.parse(JSON.stringify(revenueGraphData));
    orderPercentageGraph.datasets[0].data = churnData.order_percentage
    orderPercentageGraph.datasets[0].label = "% of Customers that placed an order"
    // ltv data
    let ltvFirstMonthGraph = JSON.parse(JSON.stringify(revenueGraphData));
    ltvFirstMonthGraph.datasets[0].data = ltvData.ltv_by_first_order
    ltvFirstMonthGraph.datasets[0].label = "LTV by First Order Date"
    let ltvLastMonthGraph = JSON.parse(JSON.stringify(revenueGraphData));
    ltvLastMonthGraph.datasets[0].data = ltvData.ltv_by_last_order
    ltvLastMonthGraph.datasets[0].label = "LTV by Last Order Date"
    // order frequency data
    totalCustomers = Object.keys(orderFrequencyData).map((key) => {
      return orderFrequencyData[key].num_customers
    })

    let totalCustomerGraph = JSON.parse(JSON.stringify(revenueGraphData));
    totalCustomerGraph.datasets[0].data = totalCustomers.reverse()
    totalCustomerGraph.datasets[0].label = "Total Customers"
    return(
      <div className="col-md-8 offset-md-2 col-12">
        <Line
          data={totalCustomerGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 250,
                      stepSize: 20,
                  }
              }]
            },
          }}
        />
        <Line
          data={ltvFirstMonthGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 25,
                      stepSize: 1,
                  }
              }]
            },
          }}
        />
        <Line
          data={ltvLastMonthGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 80,
                      stepSize: 5,
                  }
              }]
            },
          }}
        />
        <Line
          data={revenueGraphData}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 1000000,
                      stepSize: 100000,
                  }
              }]
            },
          }}
        />
        <Line
          data={totalOrdersGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 1000,
                      stepSize: 100,
                  }
              }]
            },
          }}
        />
        <Line
          data={orderSizeGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 2000,
                      stepSize: 200,
                  }
              }]
            },
          }}
        />
        <Line
          data={activeCustomerGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 100,
                      stepSize: 10,
                  }
              }]
            },
          }}
        />
        <Line
          data={newCustomerGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 100,
                      stepSize: 10,
                  }
              }]
            },
          }}
        />
        <Line
          data={churnGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: -100,
                      max: 100,
                      stepSize: 20,
                  }
              }]
            },
          }}
        />
        <Line
          data={orderPercentageGraph}
          options={{
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 50,
                      stepSize: 5,
                  }
              }]
            },
          }}
        />
      </div>
    )
  }
  render() {
    const { dataReady } = this.state
    return (
      <div className="container-fluid">
        <div className="row">
            {dataReady? this.displayCards() : <p> Loading... </p>}
        </div>
        <div className="row">
            {dataReady? this.displayCurrentCards() : <p> Loading... </p>}
        </div>
        <div className="row">
            {dataReady? this.displayUserList() : <p> Loading... </p>}
        </div>
        <div className="row">
            {dataReady? this.displayCustomers() : <p> Loading... </p>}
        </div>
        <div className="row">
            {dataReady? this.displayProducts() : <p> Loading... </p>}
        </div>
      </div>
    )
  }
}
