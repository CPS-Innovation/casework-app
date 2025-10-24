import ReactDOM from 'react-dom/client';
import { CaseInfoSummary } from './CaseInfoSummary';

class CaseInfoSummaryComponent extends HTMLElement {
  private _root: ReactDOM.Root;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._root = ReactDOM.createRoot(this.shadowRoot!);

    this._root.render(<CaseInfoSummary />);
  }
}

if (!window.customElements.get('case-info-summary')) {
  window.customElements.define('case-info-summary', CaseInfoSummaryComponent);
}
