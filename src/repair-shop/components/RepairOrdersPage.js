'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter, Link} from 'react-router-dom';
import {requestFile} from '../api'


import Loading from '../../shared/Loading';
import * as repairShopActions from '../actions/repairShopActions';

// import RepairOrderComponent from './RepairOrderComponent';

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

    // this.toRepairOrderComponent = this.toRepairOrderComponent.bind(this);
  }

  render() {
    const { repairOrders, loading, intl } = this.props;
    console.log(repairOrders)
    const contractTemplateRows = Array.isArray(repairOrders) ? repairOrders
    // .sort((a, b) => a.description.localeCompare(b.description))
      .map((contractType, index) => (
        <tr>
          {/*<tr key={index}*/}
          {/*    // ref={row => {*/}
          {/*    //   jQuery(row).tooltip({*/}
          {/*    //     content: `<b>Contract Terms:</b> <br />${contractType.conditions}`*/}
          {/*    //   });*/}
          {/*    // }}>*/}
          <td>{contractType.Id}</td>
          <td>{contractType.Name}</td>
          <td>{contractType.Description}</td>
          <td>{contractType.Level}</td>
          <td>{contractType.Owner}</td>
          <td>{activateIcon(contractType)}</td>
        </tr>
      )) : null;

    function activateIcon(contractType) {
      const activate = () => {
        console.log("hello")
        // contractTemplateActions.setContractTypeActive(contractType.uuid, true);
      };
      const requestfile = () => {
        if (contractType.Level > 0) {
          window.confirm("权限不足，你不能申请权限为" + contractType.Level + "的文件")
          return
        }
        //todo use action?
        requestFile(contractType.Id)
        //todo how to update view
        // this.setState({
        //   allowDownload: true
        // })
        window.confirm("申请成功")
        return
        // contractTemplateActions.setContractTypeActive(
        //   contractType.uuid, false);
      };
      let downloadButton = (
        <a href={"/shop/download/" + contractType.Name}>
          <button type='button'
                  className='ibm-btn-sec ibm-btn-small ibm-btn-green-50'
                  style={{marginLeft: '5px', marginRight: '5px'}}
                  onClick={activateIcon}>
            <FormattedMessage id='Download'/>
          </button>
        </a>
      );
      let requestButton = (
        <button type='button' className='ibm-btn-sec ibm-btn-small ibm-btn-red-50'
                style={{marginLeft: '5px', marginRight: '5px'}}
                onClick={requestfile}>
          <FormattedMessage id='Request'/>
        </button>
      );
      return contractType.Requested ? downloadButton : requestButton;
    }

    function formatShopTypes(contractType) {
      let {shopType} = contractType;
      if (typeof shopType !== 'string') {
        return shopType;
      }
      shopType = contractType.shopType.toUpperCase();
      return shopType.split('').map(l => {
        switch (l) {
          case 'B':
            return intl.formatMessage({id: 'Bike Shops'});
          case 'P':
            return intl.formatMessage({id: 'Phone Shops'});
          case 'S':
            return intl.formatMessage({id: 'Ski Shops'});
          default:
            return;
        }
      }).join(', ');
    }

    return (
      <Loading hidden={loading}
               text={intl.formatMessage({id: 'Loading Repair Orders...'})}>
        <div className='ibm-columns' style={{minHeight: '30vh'}}>
          <div className='ibm-col-1-1'>
            <table className='ibm-data-table ibm-altcols'>
              <thead>
              <tr>
                <th><FormattedMessage id='FileId'/></th>
                <th><FormattedMessage id='FileName'/></th>
                <th><FormattedMessage id='Description'/></th>
                <th><FormattedMessage id='Level'/></th>
                <th><FormattedMessage id='Owner'/></th>
                {/*todo remove Button*/}
                <th><FormattedMessage id='Button'/></th>
              </tr>
              </thead>
              <tbody>
              {contractTemplateRows}
              </tbody>
            </table>
          </div>
        </div>
      </Loading>
    );

    // const cards = Array.isArray(repairOrders) ?
    //   repairOrders.map(this.toRepairOrderComponent) : null;
    // const orders = ((Array.isArray(cards) && cards.length > 0) ||
    //   cards === null) ? cards :
    //   (
    //     <div className='ibm-col-5-5 ibm-col-medium-6-6'>
    //       <FormattedMessage id='No outstanding repair orders.' />
    //     </div>
    //   );
    // return (
    //   {/*<Loading hidden={loading}*/}
    //   {/*  text={intl.formatMessage({ id: 'Loading Repair Orders...' })}>*/}
    //   {/*  <div className='ibm-columns ibm-cards' style={{ minHeight: '30vh' }}*/}
    //   {/*    data-widget='masonry' data-items='.ibm-col-5-1'>*/}
    //   {/*    {orders}*/}
    //   {/*  </div>*/}
    //   {/*</Loading>*/}
    // );
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
