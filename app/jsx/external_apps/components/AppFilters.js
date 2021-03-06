import I18n from 'i18n!external_tools'
import React from 'react'
import store from 'jsx/external_apps/lib/AppCenterStore'
import $ from 'jquery'
import 'compiled/jquery.rails_flash_notifications'

export default React.createClass({
    displayName: 'AppFilters',

    getInitialState() {
      return store.getState();
    },

    onChange() {
      this.setState(store.getState());
    },

    componentDidMount: function() {
      store.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
      store.removeChangeListener(this.onChange);
    },

    handleFilterClick(filter, e) {
      e.preventDefault();
      store.setState({ filter });
      this.announceFilterResults()
    },

    applyFilter() {
      const filterText = this.filterText.value;
      store.setState({ filterText });
      this.announceFilterResults()
    },

    announceFilterResults () {
      const apps = store.filteredApps()
      $.screenReaderFlashMessageExclusive(I18n.t('%{count} apps found', { count: apps.length }))
    },

    render() {
      var activeFilter = this.state.filter || 'all';
      return (
        <div className="AppFilters">
          <div className="content-box">
            <div className="grid-row">
              <div className="col-xs-7">
                <ul className="nav nav-pills" role="tablist">
                  <li className={activeFilter === 'all' ? 'active' : ''}>
                    <a ref="tabAll" onClick={this.handleFilterClick.bind(this, 'all')} href="#" role="tab" aria-selected={activeFilter === 'all' ? 'true' : 'false'}>{I18n.t('All')}</a>
                  </li>
                  <li className={activeFilter === 'not_installed' ? 'active' : ''}>
                    <a ref="tabNotInstalled" onClick={this.handleFilterClick.bind(this, 'not_installed')} href="#" role="tab" aria-selected={activeFilter === 'not_installed' ? 'true' : 'false'}>{I18n.t('Not Installed')}</a>
                  </li>
                  <li className={activeFilter === 'installed' ? 'active' : ''}>
                    <a ref="tabInstalled" onClick={this.handleFilterClick.bind(this, 'installed')} href="#" role="tab" aria-selected={activeFilter === 'installed' ? 'true' : 'false'}>{I18n.t('Installed')}</a>
                  </li>
                </ul>
              </div>
              <div className="col-xs-5">
                <label htmlFor="filterText" className="screenreader-only">{I18n.t('Filter by name')}</label>
                <input type="text"
                  id="filterText"
                  ref={(c) => { this.filterText = c }}
                  defaultValue={this.state.filterText}
                  className="input-block-level search-query"
                  placeholder={I18n.t('Filter by name')}
                  onKeyUp={this.applyFilter} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  });
