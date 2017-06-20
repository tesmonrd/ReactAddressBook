import React, { Component } from 'react';
import './App.css';

const list = require('./test.json');

const isSearched = (searchTerm) => (item) =>
  !searchTerm || item.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.last.toLowerCase().includes(searchTerm.toLowerCase()) || item.country.toLowerCase().includes(searchTerm.toLowerCase())
  || item.street.toLowerCase().includes(searchTerm.toLowerCase()) || item.city.toLowerCase().includes(searchTerm.toLowerCase())
  || item.state.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm);


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      list,
      searchTerm: '',
      sort_term: '',
      currentPage: 1,
      addsPerPage: 10
    };

    this.handlePage = this.handlePage.bind(this);
    this.onSorting = this.onSorting.bind(this);
    this.onNumPrefChange = this.onNumPrefChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  handlePage(event) {
    let totalPages = Math.ceil(list.length/this.state.addsPerPage);
    if (event.target.id <= 0){
      event.target.id = 1;
    } else if (event.target.id > totalPages) {
      event.target.id = totalPages;
    }
    this.setState({currentPage: Number(event.target.id)});
  }

  onNumPrefChange(event) {
    if (event.key === 'Enter' && !isNaN(event.target.value)) {
      if (event.target.value < 1){
        event.target.value = 1;
      }
      else if (event.target.value > list.length){
        event.target.value = list.length;
      }
      this.setState({ addsPerPage: event.target.value });
    }
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSorting(event) {
    let term = event.target.value;
    const sortedlist = this.state.list.sort((a,b) =>{
      if(a[term] < b[term]) return -1;
      if(a[term] > b[term]) return 1;
      return 0;
    });
    this.setState({sort_term: term});
    this.setState({list: sortedlist});
  }

  render() {
    let indexOfLastAdd = this.state.currentPage * this.state.addsPerPage;
    if (indexOfLastAdd > list.length){ indexOfLastAdd = list.length}
    const indexOfFirstAdd = indexOfLastAdd - this.state.addsPerPage;
    return (
      <div className="App">

        <div className="container" id="top-bar">
        <NavLeft
          sort_term={this.state.sort_term}
          onSorting={this.onSorting}
          onSearchChange={this.onSearchChange}
        />
        <NavRight
          onNumPrefChange={this.onNumPrefChange}
          list={this.state.list}
          currentPage={this.state.currentPage}
          handlePage={this.handlePage}
          indexOfLastAdd={indexOfLastAdd}
          indexOfFirstAdd={indexOfFirstAdd}
        />
        </div>

        <Table
          list={this.state.list}
          currentPage={this.state.currentPage}
          addsPerPage={this.state.addsPerPage}
          searchTerm={this.state.searchTerm}
          indexOfLastAdd={indexOfLastAdd}
          indexOfFirstAdd={indexOfFirstAdd}
        />
      </div>
    );
  }
}

class NavLeft extends Component {
  render () {
    const { sort_term, onSorting, onSearchChange} = this.props;

    return (
      <ul id="nav-left">
        <li>
          <span className="titles">The Grand Table</span><span id="pipe"> | </span>
          <form id="selector">
          <label>
          Sort By:
          <select value={sort_term} onChange={onSorting}>
            <option value="first">First Name</option>
            <option value="last">Last Name</option>
            <option value="country">Country</option>
            <option value="city">City</option>
            <option value="state">State</option>
          </select>
        </label>
        </form>
        </li>
        <li>
          <form>
            <input
               type="search"
               placeholder="Search Page"
               onChange={onSearchChange}
            />
          </form>
        </li>
      </ul>
    );
  }
}

class NavRight extends Component {
  render() {
    const { onNumPrefChange, list, currentPage, handlePage, indexOfFirstAdd, indexOfLastAdd} = this.props;

    return (
      <ul id="nav-right">
        <li>
          <form id="countselect">
              Items per Page <input
              type="tel"
              onKeyPress={onNumPrefChange}
            />
          </form>
        </li>
        <li> <b>{indexOfFirstAdd} - {indexOfLastAdd}</b> of <b>{list.length}</b> </li>
        <li><a 
            key={currentPage - 1}
            id={currentPage - 1}
            onClick={handlePage}
            > &#60; </a>
            <a 
            key={currentPage + 1}
            id={currentPage + 1}
            onClick={handlePage}
            > &#62; </a>
        </li>
      </ul>
    )
  }
}

class Table extends Component {
  render() {
    const { list, addsPerPage, searchTerm, indexOfLastAdd, indexOfFirstAdd } = this.props;
    const currentAdds = list.filter(isSearched(searchTerm)).slice(indexOfFirstAdd, indexOfLastAdd);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(list.length / addsPerPage); i++){
      pageNumbers.push(i);
    }
    const renderAddresses = currentAdds.map(item => {
      return (
            <tr key={item.objectID}>
              <td>{item.first}</td>
              <td>{item.last}</td>
              <td>{item.country}</td>
              <td>{item.street}</td>
              <td>{item.city}</td>
              <td>{item.state}</td>
              <td>{item.zip}</td>
              <td>{item.phone}</td>
            </tr>
            )
        });

    return (
      <div id="mobile-friendly">
        <table>
          <thead>
          <tr id="headers">
            <th>First Name</th>
            <th>Last Name</th>
            <th>Country</th>
            <th id="address">Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Phone</th>
          </tr>
          </thead>
          <tbody>
          {renderAddresses}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App;
