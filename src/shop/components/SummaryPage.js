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
    // const { username, password } = this.props.user;
    // const { username } = this.props.user;
    return (
      <div>
        <div style={{float:"left" }}>
        <div className='ibm-columns' style={{width:"300px"}}>
          <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
            <h3 className='ibm-h3'>
              <FormattedMessage id='Summary' />
            </h3>
              <table cols='2' style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '.3em' }} colSpan='2'
                      className='ibm-background-blue-20'>
                      <h4 className='ibm-h4'>
                        <FormattedMessage id='All Gene Uploaded' />
                      </h4>
                    </td>
                    <td className='ibm-background-blue-10 ibm-right'>
                      <FormattedMessage id='1000' />
                    </td>
                  </tr>
                  <tr>
                    <td className='ibm-background-gray-20' colSpan='2'
                        style={{ padding: '.3em' }}>
                      <h3 className='ibm-h3'>
                        <FormattedMessage id='All Modified Gene Detected' />
                      </h3>
                    </td>
                    <td className='ibm-background-gray-10 ibm-right'>
                        <FormattedMessage id='10 all detected' />
                    </td>
                  </tr>

                  <tr>
                    <td className='ibm-background-gray-20' colSpan='2'
                        style={{ padding: '.3em' }}>
                      <h3 className='ibm-h3'>
                        <FormattedMessage id='Different Gene' />
                      </h3>
                    </td>
                    <td className='ibm-background-gray-10 ibm-right'>
                      <FormattedMessage id='1 different gene found' />
                    </td>
                  </tr>

                  <tr>
                    <td className='ibm-background-gray-20' colSpan='2'
                        style={{ padding: '.3em' }}>
                      <h3 className='ibm-h3'>
                        <FormattedMessage id='Result' />
                      </h3>
                    </td>
                    <td className='ibm-background-gray-10 ibm-right'>
                      <FormattedMessage id='You may have 3 time higher risk vulnerable to Lung Cancer' />
                    </td>
                  </tr>

                  <tr>
                    <td className='ibm-background-gray-20' colSpan='2'
                        style={{ padding: '.3em' }}>
                      <h3 className='ibm-h3'>
                        <FormattedMessage id='Suggestion' />
                      </h3>
                    </td>
                    <td className='ibm-background-gray-10 ibm-right'>
                      <FormattedMessage id='You need to stop smoke' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{float:"right",width:"500px"}}>
          <img src={"/img/right/disease.jpg"} style={{width: "500px"}} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    productInfo: state.shop.productInfo,
    contractInfo: state.insurance.contractInfo,
    user: state.userMgmt.user
  };
}

export default connect(mapStateToProps)(SummaryPage);
