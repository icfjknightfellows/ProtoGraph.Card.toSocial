import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import Form from 'react-jsonschema-form';
import Form from '../../lib/js/react-jsonschema-form.js';

export default class ShareCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
  }

  exportData() {
    return this.state;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
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

  getScreenSize() {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      height = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
      width: width,
      height: height
    };
  }

  onChangeHandler({formData}) {
    console.log(formData, this.state.step, "...................")
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data.data.cover_data = formData;
          return {
            dataJSON: dataJSON
          }
        });
        break;
      case 2:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data.data.fb_image = formData;
          return {
            dataJSON: dataJSON
          }
        });
        break;
      case 3:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data.data.instagram_image = formData;
          return {
            dataJSON: dataJSON
          }
        });
        break;
      case 4:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.configs = formData;
          return {
            dataJSON: dataJSON,
            optionalConfigJSON: formData
          }
        });
        break;
    }
  }

  onSubmitHandler({formData}) {
    // console.log(formData, "on Submit =======================");
    console.log("dataJSON", this.state.dataJSON);
    switch(this.state.step) {
      case 1:
        this.setState({
          step: 2
        });
        break;
      case 2:
        this.setState({
          step: 3
        });
        break;
      case 3:
        this.setState({
          step: 4
        });
        break;
      case 4:
        alert("The card is published");
        break;
    }
  }

  renderLaptop() {
    // console.log("renderLaptop", this.state);
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON,
        social_site_settings = this.state.dataJSON.card_data.data.social_site_settings;

      let styles,
        cover_image,
        cover_title = data.card_data.data.cover_data.cover_title,
        logo_image = typeof data.card_data.data.cover_data.logo_image === "object" ? data.card_data.data.cover_data.logo_image.image : data.card_data.data.cover_data.logo_image;

      if((this.props.mode === "edit" && this.state.step === 3) || this.props.mode === "instagram") {
        cover_image = typeof data.card_data.data.instagram_image === "object" ? data.card_data.data.instagram_image.image : data.card_data.data.instagram_image;
        styles = {
          width: social_site_settings.instagram.min_height * social_site_settings.instagram.width,
          height: social_site_settings.instagram.min_height
        }
      } else {
        cover_image = typeof data.card_data.data.fb_image === "object" ? data.card_data.data.fb_image.image : data.card_data.data.fb_image;
        styles = {
          width: social_site_settings.twitter.min_height * social_site_settings.twitter.width,
          height: social_site_settings.twitter.min_height
        }
      }
      return (
        <div>
          {cover_image &&
            <img className="proto-cover-image" style = {styles} src = {cover_image}/>
          }
          <div className = "proto-top-div">
            {logo_image &&
              <img className="proto-logo-image" src = {logo_image} />
            }
            {cover_title &&
              <div className="proto-quote-title">{cover_title}</div>
            }
          </div>
        </div>
      )
    }
  }

  renderSchemaJSON() {
    // console.log(this.state.step, "renderSchemaJSON", this.state)
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON.properties.data.properties.cover_data;
        break;
      case 2:
        return this.state.schemaJSON.properties.data.properties.fb_image;
        break;
      case 3:
        return this.state.schemaJSON.properties.data.properties.instagram_image;
        break;
      case 4:
        return this.state.optionalConfigSchemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.card_data.data.cover_data;
        break;
      case 2:
        return this.state.dataJSON.card_data.data.fb_image;
        break;
      case 3:
        return this.state.dataJSON.card_data.data.instagram_image;
        break;
      case 4:
        return this.state.optionalConfigJSON;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back to cover data';
        break;
      case 3:
        return '< Back to FB/Twitter settings';
        break;
      case 4:
        return '< Back to Instagram settings';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
      case 2:
        return 'Proceed to next step';
        break;
      case 3:
        return 'Proceed to next step';
        break;
      case 4:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
    // console.log("show prev step", this.state.step)
  }

  renderEdit() {
    // console.log(this.state.dataJSON, this.props, this.state.schemaJSON, "schema data")
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="col-sm-12">
          <div className = "col-sm-6" id="proto_share_form_div">
            <Form schema = {this.renderSchemaJSON()}
            onSubmit = {((e) => this.onSubmitHandler(e))}
            onChange = {((e) => this.onChangeHandler(e))}
            formData = {this.renderFormData()}>
            <a id="proto_prev_link" onClick = {((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
            <button type="submit" className="btn btn-info">{this.showButtonText()}</button>
            </Form>
          </div>
          <div className = "col-sm-6 proto-share-card-div" id="proto_share_card_div">
            {this.renderLaptop()}
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'facebook' :
        return this.renderLaptop();
        break;
      case 'instagram' :
        return this.renderLaptop();
        break;
      case 'twitter' :
        return this.renderLaptop();
        break;
      case 'edit' :
        return this.renderEdit();
        break;
    }

  }
}