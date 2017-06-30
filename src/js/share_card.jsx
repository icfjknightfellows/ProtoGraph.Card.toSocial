import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ShareCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          console.log(card.data,".v.v.");
          this.setState({
            fetchingData: false,
            dataJSON: card.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    }
  }


  renderLaptop() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {

      const data = this.state.dataJSON.data,
        social_site_settings = this.state.dataJSON.data.social_site_settings;

      let styles,
        cover_image,
        cover_title = data.cover_data.cover_title,
        logo_image = data.cover_data.logo_image.image;

      switch(this.props.mode) {
        case 'instagram_image':
          cover_image = data.cover_data.instagram_image.image;
          styles = {
            width: social_site_settings.instagram.min_height * social_site_settings.instagram.width,
            height: social_site_settings.instagram.min_height
          }
          break;
        case 'fb_image':
        case 'twitter':
          cover_image = data.cover_data.fb_image.image;
          styles = {
            width: social_site_settings.twitter.min_height * social_site_settings.twitter.width,
            height: social_site_settings.twitter.min_height
          }
          break;
      }

      return (
        <div>
          <div className = "proto-cover-image">
            <img className={`${(this.props.mode === "instagram_image") ? 'proto-cover-insta' : 'proto-cover-fb'}`} src={cover_image}/>
            <div className = "proto-top-div">
              <div className = "proto-top-image">
                { logo_image &&
                  <img className="proto-logo-image" src={logo_image} />
                }
              </div>
              { cover_title &&
                <div className="proto-quote-title">{cover_title}</div>
              }
            </div>
          </div>
        </div>
      )
    }
  }

  renderScreenshot() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON,
        social_site_settings = this.state.dataJSON.data.social_site_settings;
      let styles,
        cover_image,
        cover_title = data.data.cover_data.cover_title,
        logo_image = typeof data.data.cover_data.logo_image === "object" ? data.data.cover_data.logo_image.image : data.data.cover_data.logo_image;
      if(this.props.mode === "instagram") {
        cover_image = typeof data.data.cover_data.instagram_image === "object" ? data.data.cover_data.instagram_image.image : data.data.cover_data.instagram_image;
        styles = {
          width: social_site_settings.instagram.min_height * social_site_settings.instagram.width,
          height: social_site_settings.instagram.min_height
        }
      } else if(this.props.mode === "facebook" || this.props.mode === "twitter") {
        cover_image = typeof data.card_data.data.cover_data.fb_image === "object" ? data.card_data.data.cover_data.fb_image.image : undefined;
        styles = {
          width: social_site_settings.twitter.min_height * social_site_settings.twitter.width,
          height: social_site_settings.twitter.min_height
        }
      }
      return (
        <div id="ProtoScreenshot">
          {
            (this.props.mode === "instagram") ? <img className="proto-cover-insta-screenshot" style = {styles} src = {cover_image}/> : ((this.props.mode === "facebook")? <img className="proto-cover-fb-screenshot" style = {styles} src = {cover_image}/> : <img src="https://static.pexels.com/photos/1510/road-sky-sand-street.jpg"/>)
          }

        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'fb_image' :
        return this.renderLaptop();
        break;
      case 'instagram_image' :
        return this.renderLaptop();
        break;
      case 'twitter' :
        return this.renderLaptop();
        break;
      case 'screenshot' :
        return this.renderScreenshot();
        break;
    }
  }
}
