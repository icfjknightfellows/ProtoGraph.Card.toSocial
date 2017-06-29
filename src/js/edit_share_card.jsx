import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ShareCard from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form.js';

export default class EditShareCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: "fb_image",
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
  diffObject(a, b) {
    return Object.keys(a).reduce(function(map, k) {
      if (a[k]["image"] !== b[k]["image"]) map["changed"] = k;
      return map;
    }, {});
  }
  
  onChangeHandler({formData}) {
    var prev = this.state.dataJSON.card_data.data.cover_data;
    var changed = this.diffObject(prev,formData);
    var ch = document.getElementById(changed.changed);
    if(this.state.mode !== changed.changed && (changed.changed === "fb_image") || (changed.changed === "instagram_image"))
      ch.click();
    this.setState((prevStep, prop) => {
      let dataJSON = prevStep.dataJSON;
      dataJSON.card_data.data.cover_data = formData;
      return {
        dataJSON: dataJSON
      }
    });
  }


  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div>
          <div className = "protograph_col_6" id="proto_share_form_div">
            <JSONSchemaForm schema = {this.state.schemaJSON}
            onChange = {((e) => this.onChangeHandler(e))}
            formData = {this.state.dataJSON.card_data.data.cover_data}/>
          </div>
          <div className = "protograph_col_6 proto-share-card-div" id="proto_share_card_div">
            <div className="ui compact menu">
              <a className="item active" id = "fb_image" onClick = {this.handleClick}>
                <i className="facebook square icon"></i>
              </a>
              <a className="item" id = "twitter" onClick = {this.handleClick}>
                <i className="twitter square icon"></i>
              </a>
              <a className="item" id = "instagram_image" onClick = {this.handleClick}>
                <i className="instagram icon"></i>
              </a>
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
