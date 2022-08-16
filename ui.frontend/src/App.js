import { Page } from '@adobe/aem-react-editable-components';
import React from 'react';

/**
 * This component is the application entry point.
 * 
 * Optionally the index.js's use of <App ../> can be replaced with <Page ../>
 * 
 * We'll keep this broken out in case we need to do more complex App-level configurations
 * like setting context, etc.
 */
const App = (props) => (
    <Page {...props}/>
)

export default App;
