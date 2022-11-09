import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';

import { useQuery } from 'react-query';
import { useStripes } from '@folio/stripes/core';

import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import eresources from './testResources';
import translationsProperties from '../../../test/helpers';
import EResourcesRoute from './EResourcesRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  location: {},
  match: {
    params: {},
  },
  mutator: {
    query: { update: noop },
  },
  resources: { eresources }
};

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
}));

useQuery.mockImplementation(() => ({
  data: [],
  isLoading: false
}));

describe('EResourcesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourcesRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the eresources component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('eresources')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <EResourcesRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the eresources component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('eresources')).toBeInTheDocument();
      });
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => false }}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('Sorry - your permissions do not allow access to this page.')).toBeInTheDocument();
    });
  });
});
