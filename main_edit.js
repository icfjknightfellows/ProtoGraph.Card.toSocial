import React from 'react';
import ReactDOM from 'react-dom';
import EditShareCard from './src/js/edit_share_card.jsx';

ProtoGraph.Card.toShare.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toShare.prototype.renderEdit = function (data) {
  this.mode = 'edit';
  generateShareCard.call(this, data);
}

function generateShareCard(data) {
  ReactDOM.render(
    <EditShareCard
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