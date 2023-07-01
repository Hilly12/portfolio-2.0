import React, {Component, Fragment} from 'react';
import {
  Button,
  Input,
  Form,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  ButtonGroup,
  Alert
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort} from "@fortawesome/free-solid-svg-icons/faSort";
import "./Stocks.css"
import axios from "axios";
import Placeholder from "../../components/Placeholder";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import LineChart from "../../components/LineChart";
import RangeSlider from "../../components/RangeSlider";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import {faYahoo} from "@fortawesome/free-brands-svg-icons/faYahoo";

const priceTTL = 86400000; // ms - 1 day
const statTTL = 1800000; // ms - 30 min
const tryAgain = 30000; // ms - 30 sec

function fmt(market_cap) {
  return (market_cap / 1000000000.0).toFixed(2) + "B"
}

function roundUp(n, sf) {
  const factor = Math.pow(10, Math.ceil(Math.log10(n)) - sf);
  return Math.ceil(Math.ceil(n / factor) * factor);
}

function roundDown(n, sf) {
  const sig = Math.sign(n);
  if (sig >= 0) {
    if (n < 1) return 0;
    const factor = Math.pow(10, Math.floor(Math.log10(n)) - sf);
    return Math.floor(Math.floor(n / factor) * factor);
  }
  return -roundUp(Math.abs(n), sf);
}

function inRange(stock, filters) {
  for (let key of Object.keys(filters)) {
    if (stock[key] < filters[key][0] || stock[key] > filters[key][1])
      return false;
  }
  return true;
}

const indexes = {
  'USA': {
    currency: '$',
    endpoint: 'usd'
  },
  'UK': {
    currency: '£',
    endpoint: 'gbp'
  },
  'India': {
    currency: '₹',
    endpoint: 'inr'
  }
}

function process(prices) {
  Object.keys(prices).forEach(st => {
    prices[st].sort((a, b) => b.date - a.date);
  });
  return prices;
}

class Stocks extends Component {
  constructor(props) {
    super(props);

    this.loadStocks = this.loadStocks.bind(this);
    this.loadPrices = this.loadPrices.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.search = this.search.bind(this);
    this.filter = this.filter.bind(this);
    this.finishFilter = this.finishFilter.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.recomputeBounds = this.recomputeBounds.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.state = {
      index: 'USA',
      stocks: [],
      stocksLoading: true,
      pricesLoading: true,
      search: "",
      page: 0,
      filtering: false,
      filterLoading: false,
      factor: 'market_cap',
      ord: -1,
      appliedFilters: false,
      info: false,
      orders: {
        current_price: 0,
        trailing_pe: 0,
        price_to_book: 0,
        price_to_sales: 0,
        enterprise_to_ebitda: 0,
        enterprise_to_revenue: 0,
        market_cap: 1
      },
      bounds: {
        current_price: [0, 0],
        trailing_pe: [0, 0],
        price_to_book: [0, 0],
        price_to_sales: [0, 0],
        enterprise_to_ebitda: [0, 0],
        enterprise_to_revenue: [0, 0],
        market_cap: [0, 0]
      }
    }
  }

  componentDidMount() {
    this.resetFilters();
    this.loadStocks(this.state.index, true);
    this.loadPrices();
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  filterHandle = (id, val) => {
    this.setState({ filters: { ...this.state.filters, [id]: val } });
  }

  toggleFilter() {
    this.setState({ filtering: !this.state.filtering });
  }

  toggleInfo() {
    this.setState({ info: !this.state.info });
  }

  resetFilters() {
    const filters = {
      current_price: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      trailing_pe: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      price_to_book: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      price_to_sales: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      enterprise_to_ebitda: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      enterprise_to_revenue: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      market_cap: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    }
    this.setState({
      filters: filters,
    });
    return filters;
  }

  clearFilters() {
    const filters = this.resetFilters();
    this.finishFilter(filters);
    this.setState({
      appliedFilters: false
    });
  }

  loadStocks(country, init = false) {
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (cookies) {
      if (init) {
        const ct = localStorage.getItem('country');
        if (ct) {
          country = ct;
          this.setState({
            index: ct
          });
        }
      } else {
        localStorage.setItem('country', country);
      }
      const stocks = JSON.parse(localStorage.getItem(country));
      if (stocks && stocks.expiry > Date.now()) {
        this.recomputeBounds(stocks.data);
        this.setState({
          init_stocks: stocks.data,
          stocks: stocks.data,
          stocksLoading: false,
          noData: stocks.data.length === 0
        });
        return;
      }
    }

    axios.get(`https://aahil.dev/stocks/stats/${indexes[country].endpoint}/`).then((response) => {
      let st = response.data.sort((a, b) => b.market_cap - a.market_cap);
      let noData = st.length === 0;
      this.recomputeBounds(st);
      this.setState({
        init_stocks: st,
        stocks: st,
        stocksLoading: false,
        noData: noData
      });
      const stocks = {
        data: st,
        expiry: Date.now() + (noData ? tryAgain : statTTL)
      }
      localStorage.setItem(this.state.index, JSON.stringify(stocks));
    });
  }

  loadPrices() {
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (cookies) {
      const prices = JSON.parse(localStorage.getItem('prices'));
      if (prices && prices.expiry > Date.now()) {
        this.setState({
          prices: prices.data,
          pricesLoading: false
        });
        return;
      }
    }

    axios.get('https://aahil.dev/stocks/prices/').then((response) => {
      this.setState({
        prices: process(response.data),
        pricesLoading: false
      });
      const prices = {
        data: response.data,
        expiry: Date.now() + priceTTL,
      }
      localStorage.setItem('prices', JSON.stringify(prices));
    });
  }

  recomputeBounds(stocks) {
    const bounds = this.state.bounds;
    Object.keys(bounds).forEach(key => {
      bounds[key] = [0, 0];
    });
    stocks.forEach(stock => {
      Object.keys(bounds).forEach(key => {
        bounds[key][0] = Math.min(stock[key], bounds[key][0])
        bounds[key][1] = Math.max(stock[key], bounds[key][1])
      });
    });
    Object.keys(bounds).forEach(key => {
      bounds[key][0] = roundDown(bounds[key][0], 2);
      bounds[key][1] = roundUp(bounds[key][1], 2);
    });

    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (cookies) {
      const filters = localStorage.getItem(`filters${this.state.index}`);
      if (filters) {
        this.setState({
          filters: filters
        });
        return;
      }
    }
    this.setState({
      filters: bounds,
    });
  }

  changeCountry(country) {
    this.setState({
      stocksLoading: true,
      index: country
    });
    this.loadStocks(country);
  }

  search(e) {
    e.preventDefault()
    const term = this.state[e.target.id].toLowerCase();
    const factor = this.state.factor;
    const ord = this.state.ord;
    this.setState({
      stocks: this.state.init_stocks.filter(s => s.stock.ticker.toLowerCase().includes(term) || s.stock.name.toLowerCase().includes(term)).sort((s1, s2) => (s1[factor] - s2[factor]) * ord)
    });
  }

  sortBy(factor) {
    const orders = this.state.orders;
    let ord = orders[factor];
    orders[factor] = (orders[factor] + 1) % 2;
    ord = ord * 2 - 1;
    if (!this.state.pricesLoading && !this.state.stocksLoading) {
      this.setState({
        factor: factor,
        ord: ord,
        stocks: this.state.stocks.sort((s1, s2) => (s1[factor] - s2[factor]) * ord),
        orders: orders
      });
    }
  }

  filter() {
    this.setState({
      filterLoading: true
    });
    setTimeout(() => {
      this.finishFilter(this.state.filters);
      this.toggleFilter();
    }, 200);
  }

  finishFilter(filters) {
    const factor = this.state.factor;
    const ord = this.state.ord;
    this.setState({
      stocks: this.state.init_stocks.filter(st => inRange(st, filters)).sort((s1, s2) => (s1[factor] - s2[factor]) * ord),
      appliedFilters: true,
      filterLoading: false
    });
  }

  render() {
    const stocks = this.state.stocks;
    const prices = this.state.prices;
    const noData = this.state.noData;
    const lastPage = Math.ceil(this.state.stocks.length / 50);
    const min = Math.max(Math.min(Math.max(0, this.state.page - 2), lastPage - 5), 0);
    const max = Math.min(lastPage, min + 5);

    return (
      <Fragment>
        <div className="container" style={{ minHeight: "100vh" }}>
          <div className="heading">
            <ButtonGroup size="sm">
              <Button outline onClick={() => this.changeCountry('USA')} active={this.state.index === 'USA'}
                      color="info" className="button-group">USA</Button>
              <Button outline onClick={() => this.changeCountry('UK')} active={this.state.index === 'UK'}
                      color="info" className="button-group">UK</Button>
              <Button outline onClick={() => this.changeCountry('India')} active={this.state.index === 'India'}
                      color="info" className="button-group">India</Button>
            </ButtonGroup>
          </div>
          <Form id="search" onSubmit={this.search} style={{ display: 'flex' }}>
            <Input
              autoComplete="off"
              id="search"
              placeholder="Enter company name or ticker"
              onChange={this.onChange}
              style={{ backgroundColor: '#f9f9f9', marginRight: '6px' }}
            />
            <Button style={{ marginRight: '6px' }} type="submit" color="info">Search</Button>
            <Button style={{ marginRight: '6px' }} disabled={this.state.pricesLoading || this.state.stocksLoading}
                    onClick={this.toggleFilter} outline color="info">Filter</Button>
            {this.state.appliedFilters &&
            <Button color="danger" onClick={this.clearFilters} size="sm">
              <FontAwesomeIcon icon={faTrash}/>
            </Button>}
          </Form>
          <br/>
          {(this.state.pricesLoading || this.state.stocksLoading) ?
            <Placeholder classes="landing-placeholder" margin="15% auto auto"/> :
            <div className="classes group">
              <Fragment>
                <Alert color="danger" isOpen={noData}>
                  Blocked by Yahoo, temporarily unavailabe :(
                </Alert>
                <div className="table-overflow">
                  <Table style={{ textAlign: "left" }}>
                    <thead>
                    <tr className="text-muted stock-row" style={{ whiteSpace: 'pre' }}>
                      <th/>
                      <th onClick={() => this.sortBy('current_price')} className="stock-row-h">
                        Price (%1D) {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('market_cap')} className="stock-row-h">
                        Market Cap {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('trailing_pe')} className="stock-row-h">
                        P/E {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('price_to_book')} className="stock-row-h">
                        P/B {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('price_to_sales')} className="stock-row-h">
                        P/S {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('enterprise_to_ebitda')} className="stock-row-h">
                        EV/EBITDA {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th onClick={() => this.sortBy('enterprise_to_revenue')} className="stock-row-h">
                        EV/GP {' '}<FontAwesomeIcon icon={faSort}/>
                      </th>
                      <th>
                        Chart (6M)
                        <FontAwesomeIcon size="lg" className="info-icon" style={{ marginLeft: '10px' }}
                                         onClick={this.toggleInfo} icon={faInfoCircle}/>
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.slice(this.state.page * 50, (this.state.page + 1) * 50).map((stock, key) => {
                      let prev = stock.mean_price_200;
                      let mvdiff = ((stock.current_price - prev) / prev);
                      let diff = (stock.regular_market_change / stock.current_price) * 100;
                      let pdiff = Math.abs(Math.round(diff * 100) / 100).toFixed(2);
                      let displayPrice = (Math.round(parseFloat(stock.current_price) * 100) / 100).toFixed(2)
                      return (
                        <tr key={key}>
                          <th style={{ textAlign: "left", width: '80px' }}>
                            <a href={`https://finance.yahoo.com/quote/${stock.stock.ticker}`} target="_blank"
                               rel="noopener noreferrer">
                              {this.state.index === 'India' ? stock.stock.ticker.replace('.NS', '')
                                : (this.state.index === 'UK' ? stock.stock.ticker.replace('.L', '')
                                  : stock.stock.ticker)}
                            </a>
                          </th>
                          <th className="line" style={{ textAlign: "left" }}>
                            {indexes[this.state.index].currency}{displayPrice} {' '}
                            {diff !== 0 && (diff > 0 ?
                              <span style={{ color: 'green' }}>(+{pdiff})</span> :
                              <span style={{ color: 'red' }}>(-{pdiff})</span>)
                            }
                          </th>
                          <th>{indexes[this.state.index].currency}{fmt(stock.market_cap)}</th>
                          <th>{stock.trailing_pe.toFixed(2)}</th>
                          <th>{stock.price_to_book.toFixed(2)}</th>
                          <th>{stock.price_to_sales.toFixed(2)}</th>
                          <th>{stock.enterprise_to_ebitda.toFixed(2)}</th>
                          <th>{stock.enterprise_to_revenue.toFixed(2)}</th>
                          <th>
                            <LineChart color={mvdiff >= 0 ? 'green' : 'red'}
                                       data={prices[stock.stock.id]} x='date'
                                       y='price'/>
                          </th>
                        </tr>)
                    })}
                    </tbody>
                  </Table>
                </div>
                <Pagination style={{ justifyContent: 'center' }}>
                  <PaginationItem>
                    <PaginationLink onClick={() => this.setState({ page: 0 })} first/>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => this.setState({ page: Math.max(0, this.state.page - 1) })} previous/>
                  </PaginationItem>
                  {Array.from({ length: max - min }, (v, k) => k + min).map(i =>
                    <PaginationItem active={i === this.state.page} key={i}>
                      {this.state.page === i ? <PaginationLink>{i + 1}</PaginationLink>
                        : <PaginationLink onClick={() => this.setState({ page: i })}>{i + 1}</PaginationLink>}
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink onClick={() => this.setState({ page: Math.min(this.state.page + 1, lastPage - 1) })}
                                    next/>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => this.setState({ page: (lastPage - 1) })} last/>
                  </PaginationItem>
                </Pagination>
                <span className="text-muted">{lastPage} pages</span>
              </Fragment>
            </div>
          }
          {this.state.filtering &&
          <Modal title="Filter" toggle={this.toggleFilter}>
            <div className="container" style={{ padding: '10px 30px 0 30px', textAlign: 'left' }}>
              <span style={{ marginLeft: '-7px' }}>Price</span>
              <RangeSlider id="current_price" update={this.filterHandle} filters={this.state.filters}
                           bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Price / Earnings</span>
              <RangeSlider id="trailing_pe" update={this.filterHandle} filters={this.state.filters}
                           bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Price / Book</span>
              <RangeSlider id="price_to_book" update={this.filterHandle} filters={this.state.filters}
                           bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Price / Sales</span>
              <RangeSlider id="price_to_sales" update={this.filterHandle} filters={this.state.filters}
                           bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Enterprise Value / EBITDA</span>
              <RangeSlider id="enterprise_to_ebitda" update={this.filterHandle}
                           filters={this.state.filters} bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Enterprise Value / Gross Profit</span>
              <RangeSlider id="enterprise_to_revenue" update={this.filterHandle}
                           filters={this.state.filters} bounds={this.state.bounds}/>

              <span style={{ marginLeft: '-7px' }}>Market Capitalization</span>
              <RangeSlider id="market_cap" update={this.filterHandle} filters={this.state.filters}
                           bounds={this.state.bounds}/>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                  color="primary"
                  onClick={this.filter}
                  size="sm"
                  style={{ minWidth: '80px' }}
                >
                  Apply
                  {this.state.filterLoading ? (
                    <Spinner className="ml-1" size="sm"/>
                  ) : null}
                </Button>
              </div>
              <br/>
            </div>
          </Modal>
          }
          {this.state.info &&
          <Modal title="Info" toggle={this.toggleInfo}>
            <div className="container text-muted" style={{ textAlign: 'left' }}>
              <ul>
                <li>Price (1D): Current price, Regular Market Change (%)</li>
                <li>Market Cap: Market Capitalization</li>
                <li>P/E: Price to Earnings Ratio</li>
                <li>P/B: Price to Book Ratio</li>
                <li>P/S: Price to Sales Ratio</li>
                <li>EV/EBITDA: Enterprise Value / EBITDA</li>
                <li>EV/GP: Enterprise Value / Gross Profit</li>
                <li>Graph: Price fluctuation over last 6 months</li>
              </ul>
              <Alert color="info">
                Powered by Yahoo Finance <FontAwesomeIcon icon={faYahoo}/>
              </Alert>
            </div>
          </Modal>
          }
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default Stocks;