import React from 'react';
import ReactDOM from 'react-dom';
import ShareCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toShare = function () {
  this.cardType = 'ShareCard';
}

ProtoGraph.Card.toShare.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toShare.prototype.setData = function (data) {
  this.data = data;
}

ProtoGraph.Card.toShare.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toShare.prototype.renderLaptop = function (data) {
  this.mode = 'laptop';
  ReactDOM.render(
    <ShareCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

ProtoGraph.Card.toShare.prototype.renderMobile = function (data) {
  this.mode = 'mobile';
  ReactDOM.render(
    <ShareCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

ProtoGraph.Card.toShare.prototype.renderEdit = function (data) {
  this.mode = 'edit';
  ReactDOM.render(
    <ShareCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}