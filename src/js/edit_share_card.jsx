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
    var id = e.target.closest('a.item').id;
    this.setState({
      type: id
    });
  }

  exportData() {
    const data = this.state;
    return {
      dataJSON: data.dataJSON,
      optionalConfigJSON: data.optionalConfigJSON,
      name: data.dataJSON.card_data.data.cover_data.cover_title.substr(0,225)
    };
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
          if(this.props.editData && (typeof this.props.editData.onLastStep === "function")) {
            this.props.editData.onLastStep();
          }
        }));
    }
  }

  diffObject(a, b) {
    return Object.keys(a).reduce(function(map, k) {
      if ((a[k] && a[k]['image']) && (b[k] && b[k]['image'])) {
        if (a[k]["image"] !== b[k]["image"]) map["changed"] = k;
      }
      return map;
    }, {});
  }

  onChangeHandler({formData}) {
    this.setState((prevStep, prop) => {
      let dataJSON = prevStep.dataJSON;
        let changed = this.diffObject(dataJSON.card_data.data.cover_data, formData.data.cover_data);
        let ch = document.getElementById(changed.changed);

      dataJSON.card_data.data.cover_data = formData.data.cover_data;

      console.log(ch);
      let state = {
        dataJSON: dataJSON
      }

      if (ch) {
        switch(ch.id) {
          case 'fb_image':
          case 'instagram_image':
            state.type = ch.id
            break;
        }
      }

      return state;
    });
  }


  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div>
          <div className = "protograph_col_6 protograph-edit-form" id="proto_share_form_div">
            <JSONSchemaForm
              schema = {this.state.schemaJSON}
              onChange = {((e) => this.onChangeHandler(e))}
              formData = {this.state.dataJSON.card_data}
            >
              <button type="submit" className="default-button protograph-primary-button protograph-submit-button">Publish</button>
            </JSONSchemaForm>
          </div>
          <div className = "protograph_col_6 proto-share-card-div" id="proto_share_card_div">
            <div className="ui compact menu">
              <a className={`item ${this.state.type === 'fb_image' ? 'active' : ''}`} id = "fb_image" onClick = {this.handleClick}>
                <i className="facebook square icon"></i>
              </a>
              <a className={`item ${this.state.type === 'twitter' ? 'active' : ''}`} id = "twitter" onClick = {this.handleClick}>
                <i className="twitter square icon"></i>
              </a>
              <a className={`item ${this.state.type === 'instagram_image' ? 'active' : ''}`} id = "instagram_image" onClick = {this.handleClick}>
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
