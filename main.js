import React from 'react';
import ReactDOM from 'react-dom';
import ShareCard from './src/js/share_card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toShare = function () {
  this.cardType = 'ShareCard';
}

ProtoGraph.Card.toShare.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toShare.prototype.renderFacebookCard = function (data) {
  this.mode = 'screenshot';
  this.screenshotMode = 'fb_image';
  generateShareCard.call(this, data);
}

ProtoGraph.Card.toShare.prototype.renderInstagramCard = function (data) {
  this.mode = 'screenshot';
  this.screenshotMode = 'instagram_image';
  generateShareCard.call(this, data);
}

ProtoGraph.Card.toShare.prototype.renderScreenshot = function (data) {
  this.mode = 'screenshot';
  this.screenshotMode = 'instagram_image';
  generateShareCard.call(this, data);
}

function generateShareCard(data) {
  ReactDOM.render(
    <ShareCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      screenshotMode={this.screenshotMode}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
