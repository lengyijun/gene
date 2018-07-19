'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import  * as API from '../../api'

import Loading from '../../../shared/Loading';
// import * as contractTemplateActions from '../../actions/contractTemplateActions';

class  ContractTemplatesPage extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      blockinfo:null,
      // loading:true
    };
    API.getBlockById(this.props.match.params.id).then(res=>{
      var r=res[0]
      console.log(r.data.data[0])
      this.setState({
        data_hash:r.header.data_hash,
        previous_hash:r.header.previous_hash,
        number: r.header.number,
        transactions:r.data.data

      })
    })
  }

  render(){
    const { loading, intl, }=this.props
    const contractTemplateRows = Array.isArray(this.state.transactions) ? this.state.transactions
      .map((t) => (
        <tr >
          <td>{t.payload.data.actions[0].header.creator.Mspid}</td>
          <td>{t.payload.data.actions[0].payload.action.proposal_response_payload.extension.chaincode_id.name }</td>
          <td>{t.payload.data.actions[0].payload.action.proposal_response_payload.extension.chaincode_id.version}</td>
          <td>{t.payload.data.actions[0].payload.action.proposal_response_payload.proposal_hash}</td>
        </tr>
      )) : null;

    return (
      <Loading hidden={!loading}
               text={intl.formatMessage({ id: 'Loading contract types...' })}>
        <div className='ibm-columns' style={{ minHeight: '30vh' }}>
          <div className='ibm-col-1-1'>
            <h3 className='ibm-h3'>
              number: {this.state.number}
            </h3>
            <h3 className='ibm-h3'>
              data_hash: {this.state.data_hash}
            </h3>
            <h3 className='ibm-h3'>
              previous_hash:{this.state.previous_hash}
            </h3>
          </div>
          {/*<div style={{ marginTop: '10px', marginBottom: '20px' }}*/}
               {/*className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>*/}
            {/*<Link type='button' className='ibm-btn-sec ibm-btn-blue-50'*/}
                  {/*to='/contract-management/new-contract-template'>*/}
              {/*<FormattedMessage id='Create Contract Template' />*/}
            {/*</Link>*/}
          {/*</div>*/}
          <div className='ibm-col-1-1'>
            <table className='ibm-data-table ibm-altcols'>
              <thead>
              <tr>
                <th><FormattedMessage id='MspId' /></th>
                <th><FormattedMessage id='Chaincode Name' /></th>
                <th><FormattedMessage id='Chaincode version' /></th>
                <th><FormattedMessage id='Proposal Hash' /></th>
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
  }
}

ContractTemplatesPage.propTypes = {
  // id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  blocks: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  // contractTemplateActions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    blocks: state.claimProcessing.blocks,
    loading: !Array.isArray(state.claimProcessing.blocks)
  };
}

function mapDispatchToProps(dispatch) {
  // return {
  //   id:this.params.id
  // };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(ContractTemplatesPage)));
