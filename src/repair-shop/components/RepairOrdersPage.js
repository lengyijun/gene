'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';

import Loading from '../../shared/Loading';
import * as repairShopActions from '../actions/repairShopActions';
import RepairOrderComponent from './RepairOrderComponent';
import {uploadGene} from '../api'

class RepairOrdersPage extends React.Component {

  static get propTypes() {
    return {
      intl: intlShape.isRequired,
      repairOrders: PropTypes.array,
      loading: PropTypes.bool.isRequired,
      repairShopActions: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.toRepairOrderComponent = this.toRepairOrderComponent.bind(this);
    this.order = this.order.bind(this);
    this.callback=this.callback.bind(this)
    this.state = {redirectToNext: false };
  }

  toRepairOrderComponent(repairOrder, index) {
    return (
      <RepairOrderComponent key={index} repairOrder={repairOrder}
        onMarkedComplete={this.props.repairShopActions.completeRepairOrder} />
    );
  }

  async callback(ll){
    console.log(ll)
    const uploadresult=await uploadGene(ll)
    console.log(uploadresult)
    this.setState({redirectToNext:true})
  }

  async order(e){
    var file_toload=e.target.files[0]
    var fileReader = new FileReader()
    fileReader.onload = function(){
      var textFromFileLoaded=fileReader.result
      console.log(textFromFileLoaded)
      var ll=textFromFileLoaded.split("\n\n\n")
      this.callback(ll)
    }.bind(this);

    fileReader.readAsText(file_toload, "UTF-8");
  }

  render() {
    const { repairOrders, loading, intl } = this.props;

    let {redirectToNext } = this.state;
    if (redirectToNext) {
      return (
        <Redirect to='/uploadsuccess' />
      );
    }
    const cards = Array.isArray(repairOrders) ?
      repairOrders.map(this.toRepairOrderComponent) : null;
    const orders = ((Array.isArray(cards) && cards.length > 0) ||
      cards === null) ? cards :
      (
        <div className='ibm-col-5-5 ibm-col-medium-6-6'>
          <FormattedMessage id='No outstanding repair orders.' />
        </div>
      );
    return (
      <Loading hidden={loading}
        text={intl.formatMessage({ id: 'Loading Repair Orders...' })}>
        <div className='ibm-columns ibm-cards' style={{ minHeight: '30vh' }}
          data-widget='masonry' data-items='.ibm-col-5-1'>
          {orders}
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right'>
              <label for="file"  className='ibm-btn-pri ibm-btn-blue-50' onChange={this.order}>Choose file to upload
              <input type="file" className='ibm-btn-pri ibm-btn-blue-50' style={{display:"none"}}/>
              </label>
            </div>
          </div>
        </div>
      </Loading>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    repairOrders: state.repairShop.repairOrders,
    loading: Array.isArray(state.repairShop.repairOrders)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    repairShopActions: bindActionCreators(repairShopActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(RepairOrdersPage)));
