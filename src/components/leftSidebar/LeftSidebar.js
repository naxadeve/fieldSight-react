import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { RegionContext } from '../../context';
import isEmpty from '../../utils/isEmpty';

/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable react/static-property-placement */
/* eslint-disable  react/sort-comp */

class LeftSidebar extends Component {
  static contextType = RegionContext;

  // translating = title => {
  //   if (
  //     title === 'app.projectInformation' ||
  //     'app.siteTypes' ||
  //     'app.regions' ||
  //     'app.mapLayers' ||
  //     'app.termsAndLabels'
  //   ) {
  //     return <FormattedMessage id={title} defaultMessage={title} />;
  //     // } else {
  //     //   return { title };
  //   }
  // };

  renderNavRoutes = () => {
    const { terms } = this.context;
    const {
      location: { pathname },
      match: { url },
    } = this.props;

    const sideNavRoutes = [
      {
        to: `${url}`,
        path: `${url}`,
        title: 'app.projectInformation',
      },
      {
        to: `${url}/site-type`,
        path: `${url}/site-type`,
        title: !isEmpty(terms)
          ? `${terms.site} Types`
          : 'app.siteTypes',
      },
      {
        to: `${url}/site-information`,
        path: `${url}/site-information`,
        title: !isEmpty(terms)
          ? `${terms.site} Information`
          : 'app.siteInformation',
      },
      {
        to: `${url}/manage-region`,
        path: `${url}/manage-region`,
        title: !isEmpty(terms) ? `${terms.region}` : 'app.regions',
      },
      {
        to: `${url}/map-layer`,
        path: `${url}/map-layer`,
        title: 'app.mapLayers',
      },
      {
        to: `${url}/term-and-label`,
        path: `${url}/term-and-label`,
        title: 'app.termsAndLabels',
      },
    ];

    return sideNavRoutes.map((route, i) => (
      <li className="nav-item" key={i}>
        <Link
          to={route.to}
          className={
            pathname === route.path ? 'nav-link active' : 'nav-link'
          }
        >
          <FormattedMessage
            id={route.title}
            defaultMessage={route.title}
          />
          {/* {this.translating(route.title)} */}
        </Link>
      </li>
    ));
  };

  render() {
    return (
      <ul className="nav nav-tabs flex-column border-tabs">
        {this.renderNavRoutes()}
      </ul>
    );
  }
}

export default withRouter(LeftSidebar);
