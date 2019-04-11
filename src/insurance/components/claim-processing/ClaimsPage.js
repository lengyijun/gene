'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  FormattedMessage, FormattedDate,
  injectIntl, intlShape
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Loading from '../../../shared/Loading';
import ClaimComponent from './ClaimComponent';
import * as claimProcessingActions from '../../actions/claimProcessingActions';

class ClaimsPage extends React.Component {

  static get propTypes() {
    return {
      intl: intlShape.isRequired,
      claims: PropTypes.array,
      loading: PropTypes.bool.isRequired,
      claimProcessingActions: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { loading, intl, claimProcessingActions, claims } = this.props;


    const contractTemplateRows = Array.isArray(claims) ? claims
    // .sort((a, b) => a.description.localeCompare(b.description))
      .map((contractType, index) => (
        <tr>
          {/*<tr key={index}*/}
          {/*    // ref={row => {*/}
          {/*    //   jQuery(row).tooltip({*/}
          {/*    //     content: `<b>Contract Terms:</b> <br />${contractType.conditions}`*/}
          {/*    //   });*/}
          {/*    // }}>*/}
          <td>{contractType.ReqId}</td>
          <td>{contractType.FileName}</td>
          <td>{contractType.Requester}</td>
          <td>{contractType.Owner}</td>
          <td>{contractType.CreateTime}</td>
          <td>{contractType.Done ? '允许' : '拒绝'} </td>
        </tr>
      )) : null;
    return (
      <Loading hidden={!loading}
               text={intl.formatMessage({id: 'Loading Repair Orders...'})}>
        <div className='ibm-columns' style={{minHeight: '30vh'}}>
          <div className='ibm-col-1-1'>
            <table className='ibm-data-table ibm-altcols'>
              <thead>
              <tr>
                <th><FormattedMessage id='ReqId'/></th>
                <th><FormattedMessage id='FileName'/></th>
                <th><FormattedMessage id='Requester'/></th>
                <th><FormattedMessage id='Owner'/></th>
                <th><FormattedMessage id='CreateTime'/></th>
                <th><FormattedMessage id='Done'/></th>
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

function mapStateToProps(state, ownProps) {
  return {
    claims: state.claimProcessing.claims,
    loading: !Array.isArray(state.claimProcessing.claims)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    claimProcessingActions: bindActionCreators(claimProcessingActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(ClaimsPage)));
