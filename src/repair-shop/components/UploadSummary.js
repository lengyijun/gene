'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

class SummaryPage extends React.Component {

  static get propTypes() {
    return {
      productInfo: PropTypes.object.isRequired,
      contractInfo: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className='ibm-columns'>
          <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
            <h3 className='ibm-h3'>
              <FormattedMessage id='Summary' />
            </h3>
          </div>
        </div>
        <div className='ibm-columns' style={{float:"left"}}>
          <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
            <div>
              <FormattedMessage id='Upload Success' />
            </div>
          </div>
        </div>
        <div style={{float:"right"}} margin="10px">
          <img src="/img/right/medical.jpg" width="600px" />
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state, ownProps) {
//   return {
//     productInfo: state.shop.productInfo,
//     contractInfo: state.insurance.contractInfo,
//     user: state.userMgmt.user
//   };
// }

// export default connect(mapStateToProps)(SummaryPage);
 export default SummaryPage;

