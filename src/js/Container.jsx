import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Form from 'react-jsonschema-form';

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
      // configSchemaJSON: undefined,
      // configJSON: {},
      oasisObj: {},
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      cover_data: {},
      FBImage: "",
      InstagramImage: ""
    }
  }

  exportData() {
    return this.state;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    console.log("dataURL", this.props.dataURL);
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          console.log("card", card);
          this.setState({
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            },
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            // configSchemaJSON: config_schema.data,
            // configJSON: config.data.optional,
            // cover_data: card.data.data.cover_data,
            FBImage: card.data.data.cover_image,
            InstagramImage: card.data.data.cover_image
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
        break;
      case 2:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data.data.cover_data = formData;
          console.log("dataJSON", dataJSON);
          return {
            dataJSON: dataJSON
          }
        });
        break;
      case 3:
        this.setState({
          FBImage: formData
        })
        break;
      case 4:
        this.setState({
          InstagramImage: formData
        })
        break;
      case 5:
        this.setState({
          configJSON: formData
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    // console.log(formData, "on Submit =======================")
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
        this.setState({
          step: 5,
          dataJSON: formData
        });
        break;
      case 5:
        alert("The card is published");
        break;
    }
  }

  renderLaptop() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      console.log("state", this.state);
      const data = this.state.dataJSON,
        social_site_settings = this.state.dataJSON.card_data.data.social_site_settings;
      let styles,
        cover_image;

      if(this.state.step === 4) {
        cover_image = this.state.InstagramImage;
        styles = {
          width: social_site_settings.instagram.min_height * social_site_settings.instagram.width,
          height: social_site_settings.instagram.min_height
        }
      } else {
        cover_image = this.state.FBImage;
        styles = {
          width: social_site_settings.twitter.min_height * social_site_settings.twitter.width,
          height: social_site_settings.twitter.min_height
        }
      }
      return (
        <div>
          <img className="proto-cover-image" style = {styles} src = {cover_image}/>
          <div className = "proto-top-div">
            <img className="proto-logo-image" src = {data.card_data.data.cover_data.logo_image} />
            <div className="proto-quote-title">{data.card_data.data.cover_data.cover_title}</div>
          </div>
        </div>
      )
    }
  }

  renderSchemaJSON() {
    console.log(this.state.step, "renderSchemaJSON", this.state)
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON.properties.mandatory_config;
        break;
      case 2:
        return this.state.schemaJSON.properties.data.properties.cover_data;
        break;
      case 3:
        return this.state.schemaJSON.properties.data.properties.cover_image;
        break;
      case 4:
        return this.state.schemaJSON.properties.data.properties.cover_image;
        break;
      case 5:
        return this.state.optionalConfigSchemaJSON.properties.optional;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.card_data.mandatory_config;
        break;
      case 2:
        return this.state.dataJSON.card_data.data.cover_data;
        break;
      case 3:
        return this.state.FBImage;
        break;
      case 4:
        return this.state.InstagramImage;
        break;
      case 5:
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
        return '< Back to Mandatory selection';
        break;
      case 3:
        return '< Back to cover data';
        break;
      case 4:
        return '< Back to FB/Twitter settings';
        break;
      case 5:
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
        return 'Proceed to next step';
        break;
      case 5:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
    console.log("show prev step", this.state.step)
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
          <div className = "col-sm-6" id="proto_share_card_div">
            {this.renderLaptop()}
          </div>
        </div>
      )
    }
  }

  render() {
    console.log(this.props.mode, "mode")
    switch(this.props.mode) {
      case 'laptop' :
        return this.renderLaptop();
        break;
      case 'mobile' :
        return this.renderLaptop();
        break;
      case 'tablet' :
        return this.renderLaptop();
        break;
      case 'edit' :
        return this.renderEdit();
        break;
    }

  }
}