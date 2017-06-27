import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ShareCard from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form.js';

export default class EditShareCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: "facebook",
      dataJSON: {
        card_data: {}
      },
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    var id = e.target.id;
    this.setState({
      type: id
    });
  }

  exportData() {
    return this.state;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          console.log(card.data,".v.v.");
          this.setState({
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            },
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    }
  }

  onChangeHandler({formData}) {
    this.setState((prevStep, prop) => {
      let dataJSON = prevStep.dataJSON;
      dataJSON.card_data.data.cover_data = formData;
      console.log(dataJSON,"vvV");
      return {
        dataJSON: dataJSON
      }
    });
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
    // console.log("show prev step", this.state.step)
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="col-sm-12">
          <div className = "col-sm-6" id="proto_share_form_div">
            <JSONSchemaForm schema = {this.state.schemaJSON}
            onChange = {((e) => this.onChangeHandler(e))}
            formData = {this.state.dataJSON.card_data.data.cover_data}>
            </JSONSchemaForm>
          </div>
          <div className = "col-sm-6 proto-share-card-div" id="proto_share_card_div">
            <div className ="ui three item menu">
              <a className ="item active" id = "facebook" onClick = {this.handleClick}>Facebook</a>
              <a className ="item" id = "twitter" onClick = {this.handleClick}>Twitter</a>
              <a className ="item" id = "instagram" onClick = {this.handleClick}>Instagram</a>
            </div>
            <div className = "preview">
              <ShareCard
                mode={this.state.type}
                dataJSON={this.state.dataJSON}
                schemaJSON={this.state.schemaJSON}
                optionalConfigJSON={this.state.optionalConfigJSON}
                optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}
