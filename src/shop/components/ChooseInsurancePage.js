'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter, Redirect } from 'react-router-dom';

import Loading from '../../shared/Loading';
import * as insuranceActions from '../actions/insuranceActions';
import {uploadFileIndex} from '../api';

class ChooseInsurancePage extends React.Component {

  static get propTypes() {
    return {
      intl: intlShape.isRequired,
      // shopType: PropTypes.string.isRequired,
      productInfo: PropTypes.object.isRequired,
      contractsLoaded: PropTypes.bool.isRequired,
      contractTypes: PropTypes.array.isRequired,
      contractInfo: PropTypes.object,
      insuranceActions: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      contractType: {},
      dailyPrice: '',
      contractInfo: props.contractInfo || {
        filename: '',
        ownername: '',
        description: '',
        startDate: 0,
        endDate: 0,
        level: 0
      }
    };

    this.nextStep = this.nextStep.bind(this);
    // this.setContractType = this.setContractType.bind(this);
    this.setContractInfo = this.setContractInfo.bind(this);
    this.getContractCaption = elem => elem.description;
    this.setStartDate = date => this.setContractInfo(
      { element: 'startDateField', value: date });
    this.setEndDate = date => this.setContractInfo(
      { element: 'endDateField', value: date });
  }

  componentWillMount() {
    if (!this.state.contractType.uuid) {
      // if (this.props.contractsLoaded && !this.state.contractType.uuid) {
      const contractType = this.props.contractInfo ?
        this.props.contractTypes.find(
          ct => ct.id === this.props.contractInfo.uuid) :
        // Fallback to the first one, if none is defined.
        this.props.contractTypes[0];

      // this.setContractType(contractType);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( !this.state.contractType.uuid) {
      // if (nextProps.contractsLoaded && !this.state.contractType.uuid) {
      const contractType = nextProps.contractInfo ?
        nextProps.contractTypes.find(
          ct => ct.id === nextProps.contractInfo.uuid) :
        // Fallback to the first contract type
        nextProps.contractTypes[0];

      // this.setContractType(contractType);
    }
  }

  // setContractType(contractType) {
  //   this.setState(Object.assign({}, this.state,
  //     {
  //       contractType,
  //       dailyPrice: contractType.formulaPerDay(this.props.productInfo.price)
  //     }));
  // }

  setContractInfo(event) {
    let obj;
    if (event.target) {
      switch (event.target) {
        case this.refs.firstNameField:
          obj = {filename: event.target.value };
          break;
        case this.refs.level:
          var level = Number(event.target.value)
          if (isNaN(level)) {
            level = 0
          }
          // obj = {level: event.target.value};
          obj = {level: level};
          break;
        case this.refs.emailField:
          obj = {description: event.target.value };
          break;
        default:
          return;
      }
    } else if (typeof event.element === 'string') {
      switch (event.element) {
        case 'startDateField':
          obj = { startDate: event.value };
          break;
        case 'endDateField':
          obj = { endDate: event.value };
          break;
        default:
          return;
      }
    } else {
      return;
    }
    this.setState(Object.assign({},
      this.state,
      { contractInfo: Object.assign({}, this.state.contractInfo, obj) }));
  }

  async nextStep(e) {
    if (!((this.state.contractInfo.level == 0) ||
        (this.state.contractInfo.level == 1) ||
        (this.state.contractInfo.level == 2) ||
        (this.state.contractInfo.level == 3))) {
      window.confirm("error level! level should be in 0,1,2,3")
      return
    }

    var file_toload = e.target.files[0]
    var fileReader = new FileReader()
    fileReader.onload = function () {
      var textFromFileLoaded = fileReader.result
      this.callback(textFromFileLoaded, file_toload.name)
    }.bind(this);

    // fileReader.readAsText(file_toload, "UTF-8");
    fileReader.readAsBinaryString(file_toload);
  }

  async callback(fileContent, fileName) {
    const uploadresult = await uploadFileIndex(
      fileName,
      // this.state.contractInfo.filename,
      this.state.contractInfo.description,
      this.state.contractInfo.level,
      fileContent)
    console.log("callback result: ")
    console.log(uploadresult)
    window.confirm(fileName + "上传成功")
    // const { userMgmtActions } = this.props;
  }

  render() {
    let messageAtTop;
    // switch (this.props.shopType) {
    //   case 'bikes':
    //     messageAtTop = <FormattedMessage id='Buy Insurance for the Bike' />;
    //     break;
    //   case 'smart-phones':
    //     messageAtTop = <FormattedMessage
    //       id='Buy Insurance for the Smart Phone' />;
    //     break;
    //   case 'skis':
    //     messageAtTop = <FormattedMessage id='Buy Insurance the Pair of Skis' />;
    //     break;
    // }

    const contractTypes=[{description:"Heart Disease"},{description:"Diabete"} ,{ description: "Lung Cancer"} ]
    let { contractType, contractInfo, dailyPrice, redirectToNext } = this.state;
    let { intl, contractsLoaded } = this.props;

    if (redirectToNext) {
      return (
        <Redirect to='/payment' />
      );
    }

    return (
      <Loading hidden={true}
        text={intl.formatMessage({ id: 'Loading Contracts...' })}>
        <div style={{float:"left",width:"300px"}}>
          <div className='ibm-columns'>
            <div className='ibm-col-1-1'>
              {/*<h3 className='ibm-h3'>{messageAtTop}</h3>*/}
            </div>
          </div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
              <div className='ibm-column-form'>
                {/*delete following code as Master require*/}
                {/*<p>*/}
                  {/*<label><FormattedMessage id='Contract' />:</label>*/}
                  {/*<span>*/}
                    {/*<SelectList options={contractTypes}*/}
                      {/*getCaptionFunc={this.getContractCaption}*/}
                      {/*// onChange={this.setContractType}*/}
                      {/*// selectedItemIndex={contractTypes.indexOf(contractType)}*/}
                    {/*/>*/}
                  {/*</span>*/}
                {/*</p>*/}
                {/*<p>*/}
                  {/*<label><FormattedMessage id='Daily Price' />:</label>*/}
                  {/*<span>*/}
                    {/*<input ref='firstNameField' value={contractInfo.firstName}*/}
                           {/*type='text' onChange={this.setContractInfo} />*/}
                    {/*<input type='text' readOnly value={*/}
                      {/*intl.formatNumber(dailyPrice,*/}
                        {/*{*/}
                          {/*style: 'currency',*/}
                          {/*currency: intl.formatMessage({ id: 'currency code' }),*/}
                          {/*minimumFractionDigits: 2*/}
                        {/*})} />*/}
                  {/*</span>*/}
                {/*</p>*/}
                {/*<p>*/}
                  {/*<label><FormattedMessage id='Contract Terms' />:</label>*/}
                  {/*<span>*/}
                    {/*<textarea value={contractType.conditions} readOnly />*/}
                  {/*</span>*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*<label><FormattedMessage id='First Name' />:*/}
                {/*<span className='ibm-required'>*</span></label>*/}
                {/*<span>*/}
                {/*<input ref='firstNameField' value={contractInfo.filename}*/}
                {/*type='text' onChange={this.setContractInfo} />*/}
                {/*</span>*/}
                {/*</p>*/}
                <p>
                  <label><FormattedMessage id='Level'/>:
                  <span className='ibm-required'>*</span></label>
                  <span>
                    <input ref='level' value={contractInfo.level}
                           type='text' onChange={this.setContractInfo}/>
                  </span>
                </p>
                <p>
                  <label><FormattedMessage id='E-mail Address' />:
                  <span className='ibm-required'>*</span></label>
                  <span>
                    <input ref='emailField' value={contractInfo.description}
                      type='text' onChange={this.setContractInfo} />
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right'>
              {/*<button type='button' className='ibm-btn-pri ibm-btn-blue-50' onClick={this.nextStep}>*/}
              {/*<FormattedMessage id='Next' />*/}
              {/*</button>*/}

              <label for="file" className='ibm-btn-pri ibm-btn-blue-50' onChange={this.nextStep}>选择上传的文件
                <input type="file" style={{display: "none"}}/>
              </label>
            </div>
          </div>
        </div>
        <div style={{float:"right"}} margin="10px">
          <img src="/img/right/safety.jpg" width="600px" />
        </div>
      </Loading>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    shopType: state.shop.type,
    productInfo: state.shop.productInfo,
    contractsLoaded: Array.isArray(state.insurance.contractTypes),
    contractTypes: state.insurance.contractTypes || [],
    contractInfo: state.insurance.contractInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    insuranceActions: bindActionCreators(insuranceActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(ChooseInsurancePage)));
