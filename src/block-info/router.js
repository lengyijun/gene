import React, { Props } from 'react';
import {
  BrowserRouter as Router, Route, Switch, withRouter
} from 'react-router-dom';

import App from './components/App';
// import RepairOrdersPage from './components/RepairOrdersPage';
// import UploadSummary from './components/UploadSummary'
import NotFoundPage from '../shared/NotFoundPage';
import ContractManagementApp from './components/contract-management/App';
import ContractTemplatesPage
  from './components/contract-management/ContractTemplatesPage';
import NewContractTemplatePage
  from './components/contract-management/NewContractTemplatePage';

export default function router() {
  return (
    <Router basename='block-info'>
      <App>
        <Switch>
          {/*<Route exact path='/' component={RepairOrdersPage} />*/}
          {/*<Route path='/uploadsuccess' component={UploadSummary} />*/}

          <Route path='/'>
            <ContractManagementApp>
              <Switch>
                <Route exact path='/contract-management'
                       component={ContractTemplatesPage} />
                <Route path='/contract-management/new-contract-template'
                       component={NewContractTemplatePage} />
                <Route component={NotFoundPage} />
              </Switch>
            </ContractManagementApp>
          </Route>

          <Route component={NotFoundPage} />
        </Switch>
      </App>
    </Router>
  );
}
