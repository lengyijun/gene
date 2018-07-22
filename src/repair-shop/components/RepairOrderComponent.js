'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class RepairOrderComponent extends React.Component {

  static get propTypes() {
    return {
      repairOrder: PropTypes.object.isRequired,
      onMarkedComplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.markComplete = this.markComplete.bind(this);
    this.order=this.order.bind(this);
  }

  markComplete(ll) {
    const { repairOrder, onMarkedComplete } = this.props;
    if (typeof onMarkedComplete === 'function') {
      setTimeout(() => { onMarkedComplete(this.props.repairOrder.UUID ,ll); });
    }
  }

  async order(e){
    var file_toload=e.target.files[0]
    var fileReader = new FileReader()
    fileReader.onload = function(){
      var textFromFileLoaded=fileReader.result
      console.log(textFromFileLoaded)
      var ll=textFromFileLoaded.split("\n\n\n")
      this.markComplete(ll)
    }.bind(this);

    fileReader.readAsText(file_toload, "UTF-8");
  }

  render() {
    const { repairOrder } = this.props;

    return (
      <div className='ibm-col-5-1 ibm-col-medium-6-2'>
        <div className='ibm-card ibm-border-gray-50'>
          <div className='ibm-card__content'>
            <h4 className='ibm-bold ibm-h4'>
              <FormattedMessage id='Repair Order' />
            </h4>
            <div style={{ wordWrap: 'break-word' }}>
              <p>
                <FormattedMessage id='UUID' />:
                  {repairOrder.UUID} <br />
                <FormattedMessage id='Intersection Calaculated' />:
                  false <br />
                <FormattedMessage id='Medical Center Uploaded' />:
                {Array.isArray(repairOrder.OfficialGene).toString()} <br />
                <FormattedMessage id='Create Time' />:
                {repairOrder.CreateTime} <br />
              </p>
              <p>
                <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right'>
                  <label for="file"  className='ibm-btn-pri ibm-btn-blue-50' onChange={this.order} style={{float:"left"}}>Choose file to upload
                    <input type="file" className='ibm-btn-pri ibm-btn-blue-50' style={{display:"none"}}/>
                  </label>
                </div>
                {/*<button type='button'*/}
                  {/*className='ibm-btn-sec ibm-btn-small ibm-btn-blue-50'*/}
                  {/*onClick={this.markComplete}>*/}
                  {/*<FormattedMessage id='Mark Completed' />*/}
                {/*</button>*/}
              </p>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default RepairOrderComponent;
