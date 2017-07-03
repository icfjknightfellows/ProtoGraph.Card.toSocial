import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ShareCard from './share_card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form.js';

export default class EditShareCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
      type: "fb_image",
      dataJSON: {},
      schemaJSON: undefined
    }
    this.handleClick = this.handleClick.bind(this);
    this.publishCard = this.publishCard.bind(this);
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
      name: data.dataJSON.data.cover_data.cover_title.substr(0,225)
    };
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL)
      ]).then(axios.spread((card, schema) => {

        this.setState({
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data
        });
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
        let changed = this.diffObject(dataJSON.data.cover_data, formData.data.cover_data);
        let ch = document.getElementById(changed.changed);

      dataJSON.data.cover_data = formData.data.cover_data;
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

  publishCard(e) {
    if (typeof this.props.onPublishCallback === "function") {
      this.props.onPublishCallback();
    }
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div>
          <div className = "protograph_col_6 protograph-edit-form" id="proto_share_form_div">
            <JSONSchemaForm
              schema={this.state.schemaJSON}
              onChange={((e) => this.onChangeHandler(e))}
              onSubmit={this.publishCard}
              formData={this.state.dataJSON}
            >
              <button
                type="submit"
                className="default-button protograph-primary-button protograph-submit-button"
              >
                Publish
              </button>
            </JSONSchemaForm>
          </div>
          <div className = "protograph_col_6 proto-share-card-div" id="proto_share_card_div">
            <div className="ui compact menu">
              <a className={`item ${this.state.type === 'fb_image' ? 'active' : ''}`}
                id="fb_image"
                onClick={this.handleClick}
              >
                <i className="facebook square icon"></i>
              </a>
              <a className={`item ${this.state.type === 'twitter' ? 'active' : ''}`}
                id="twitter"
                onClick={this.handleClick}
              >
                <i className="twitter square icon"></i>
              </a>
              <a className={`item ${this.state.type === 'instagram_image' ? 'active' : ''}`}
                id="instagram_image"
                onClick={this.handleClick}
              >
                <i className="instagram icon"></i>
              </a>
            </div>

            <div className = "preview">
              <ShareCard
                mode={this.state.type}
                dataJSON={this.state.dataJSON}
                schemaJSON={this.state.schemaJSON}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}
