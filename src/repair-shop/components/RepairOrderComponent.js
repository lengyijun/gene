'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {requestFile, saveFile} from '../api'

class RepairOrderComponent extends React.Component {

  static get propTypes() {
    return {
      repairOrder: PropTypes.object.isRequired,
      onMarkedComplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    // this.markComplete = this.markComplete.bind(this);
    this.order=this.order.bind(this);
    this.download = this.download.bind(this)
    this.state = {
      allowDownload: false,
      symKey: ""
    }
  }

  async order(e){
    if (this.props.repairOrder.Level > 0) {
      window.confirm("you cannot request file, which is leveled " + this.props.repairOrder.Level)
      return
    }
    console.log(this.props.repairOrder)
    var res = await  requestFile(this.props.repairOrder.Id)
    console.log(res.decryptkey)
    this.setState({
      symKey: res.decryptkey,
      allowDownload: true
    })
    await saveFile(this.props.repairOrder.Id,
      this.state.symKey,
      this.props.repairOrder.Name
    )
    window.confirm("request success")
    return
  }

  async download(e) {
    if (this.props.repairOrder.Level > 0) {
      window.confirm("you cannot download file, which is leveled " + this.props.repairOrder.Level)
      return
    }
    console.log("allow Download")
    return
  }

  render() {
    const { repairOrder } = this.props;
    let button;
    if (this.state.allowDownload) {
      button = <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right' onClick={this.download}>
        <a href={"http://localhost:4000/shop/download/" + repairOrder.Name}>
          <label for="file" className='ibm-btn-pri ibm-btn-green-50' onChange={this.download} style={{float: "left"}}>
            <FormattedMessage id='Download'/>:
          </label>
        </a>
      </div>
    } else {
      button = <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right' onClick={this.order}>
        <label for="file" className='ibm-btn-pri ibm-btn-blue-50' onChange={this.order} style={{float: "left"}}>
          <FormattedMessage id='Request'/>:
        </label>
      </div>

    }

    return (
      <div className='ibm-col-5-1 ibm-col-medium-6-2'>
        <div className='ibm-card ibm-border-gray-50'>
          <div className='ibm-card__content'>
            <h4 className='ibm-bold ibm-h4'>
              {repairOrder.Name}
              {/*<FormattedMessage id='Repair Order' />*/}
            </h4>
            <div style={{ wordWrap: 'break-word' }}>
              <p>
                <FormattedMessage id='UUID' />:
                {repairOrder.Id} <br/>
                {/*<FormattedMessage id='FileName' />:*/}
                {/*{repairOrder.Name} <br />*/}
                <FormattedMessage id='Owner'/>
                {repairOrder.Owner} <br />
                <FormattedMessage id='Description' />:
                {repairOrder.Description} <br />
                <FormattedMessage id='Level'/>:
                {repairOrder.Level} <br/>
                {/*<FormattedMessage id='Intersection Calculated' />:*/}
                {/*false <br />*/}
                {/*<FormattedMessage id='Medical Center Uploaded' />:*/}
                {/*{Array.isArray(repairOrder.OfficialGene).toString()} <br />*/}
                <FormattedMessage id='Create Time' />:
                {repairOrder.CreateTime} <br />
                <FormattedMessage id='Update Time' />:
                {repairOrder.UpdateTime} <br />
              </p>
              <p>
                {button}
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
