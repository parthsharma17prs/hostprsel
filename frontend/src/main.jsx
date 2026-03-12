import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'

// Force scroll positions to top on reload
if ('scrollRestoration' in window.history)
{
  window.history.scrollRestoration='manual';
}
window.scrollTo(0, 0);

import store from './store/store.js'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

)
