import React, { Component } from "react";
import { Form, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import RoleBasedAclContract from "./contracts/RoleBasedAcl.json";
import getWeb3 from "./getWeb3";
import swal from "sweetalert";

import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      publicAddress: null,
      role: null,
      isValidAddress: false,
      listAddressAndRole: null
    };
    this.roles = {
      0: "Super Admin",
      1: "Notary"
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // handle change account in metamask
      window.ethereum.on("accountsChanged", accounts => {
        this.setState({ accounts });
      });
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RoleBasedAclContract.networks[networkId];
      if (!deployedNetwork) {
        throw new Error("Switch Ether network to http://127.0.0.1:7545");
      }
      const instance = new web3.eth.Contract(
        RoleBasedAclContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({ web3, accounts, contract: instance }, this.fetchDataTable);
    } catch (error) {
      // Catch any errors for any of the above operations.
      // alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      swal("Error!", error.message, "error");
      console.error(error);
    }
  };

  fetchDataTable = async () => {
    try {
      const { contract } = this.state;
      const response = await contract.methods.getAllAddressAndRole().call();
      const listAddressAndRole = response[0].map((item, index) => [item, response[1][index]]);
      this.setState({ listAddressAndRole });
    } catch (error) {
      swal("Error!", error.message, "error");
    }
  };

  addRole = async (address, role) => {
    try {
      const { contract, accounts } = this.state;
      // add role for address
      const response = await contract.methods.addRole(address, role).send({ from: accounts[0] });
      console.log("App -> addRole -> response", response);
      swal({
        title: "Assign role successfully!",
        text: `Transaction hash: ${response.transactionHash}`,
        icon: "success"
      });
      this.fetchDataTable();
    } catch (error) {
      swal("Error!", error.message, "error");
    }
  };

  removeRole = async (address, role) => {
    try {
      const isconfirm = await swal("", `Are you sure assign role address ${address}`, "warning");
      if (isconfirm) {
        const { contract, accounts } = this.state;
        const response = await contract.methods
          .removeRole(address, role)
          .send({ from: accounts[0] });
        console.log("App -> removeRole -> response", response);
        swal({
          title: "Unassign role successfully",
          text: `Transaction hash: ${response.transactionHash}`,
          icon: "success"
        });
        this.fetchDataTable();
      }
    } catch (error) {
      swal("Error!", error.message, "error");
    }
  };

  handleInputChange = event => {
    const publicAddress = event.target.value;
    const isValidAddress = /^(0x)?[0-9a-f]{40}$/i.test(publicAddress);
    this.setState({ publicAddress, isValidAddress });
  };

  handleDeleteRow = index => {
    const { listAddressAndRole } = this.state;
    this.removeRole(...listAddressAndRole[index]);
  };

  renderTableData = () => {
    if (!this.state.listAddressAndRole) {
      return;
    }
    return this.state.listAddressAndRole.map((item, index) => {
      const [publicAddress, role] = item;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{publicAddress}</td>
          <td>{this.roles[role]}</td>
          <td>
            <Button variant="danger" onClick={() => this.handleDeleteRow(index)}>
              Remove
            </Button>
          </td>
        </tr>
      );
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container">
          <h1>Real Estate Roles Management</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Address</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </Table>
          <hr />
          <Form
            onSubmit={event => {
              event.preventDefault();
              const address = this.address.value;
              const notary = this.role.value;
              this.addRole(address, notary);
            }}
          >
            <Form.Group>
              <Form.Label>Public address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                ref={input => {
                  this.address = input;
                }}
                placeholder="Enter public address"
                required
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                ref={input => {
                  this.role = input;
                }}
              >
                <option value="1">Notary</option>
                <option value="0">Super Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!this.state.isValidAddress}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
