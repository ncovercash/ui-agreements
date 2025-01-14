import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { useSettings } from '@k-int/stripes-kint-components';

import GeneralSettings from './GeneralSettings';

import {
  PickListSettings,
  PickListValueSettings
} from './routes';

import {
  REFDATA_ENDPOINT,
  SETTINGS_ENDPOINT
} from '../constants';

import { AgreementsCustomProperties } from './components';

const ErmSettings = (props) => {
  const stripes = useStripes();
  const allowGlobalEdit = stripes.hasPerm('ui-agreements.appSettings.manage');
  const { isLoading, pageList, SettingsComponent } = useSettings({
    allowGlobalEdit,
    dynamicPageExclusions: ['registry'], // Registry AppSettings hold StringTemplating details etc -- not for user editing
    persistentPages: [],
    refdataEndpoint: REFDATA_ENDPOINT,
    settingEndpoint: SETTINGS_ENDPOINT
  });
  const sections = [
    {
      label: <FormattedMessage id="ui-agreements.settings.general" />,
      pages: [
        {
          route: 'general',
          label: <FormattedMessage id="ui-agreements.settings.displaySettings" />,
          perm: 'ui-agreements.generalSettings.view',
          component: GeneralSettings,
        },
        {
          component: AgreementsCustomProperties,
          label: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
          perm: 'ui-agreements.supplementaryProperties.view',
          route: 'supplementaryProperties',
        },
      ]
    },
    {
      label: <FormattedMessage id="ui-agreements.settings.supplementaryPropertyPickList" />,
      pages: [
        {
          component: PickListSettings,
          label: <FormattedMessage id="ui-agreements.settings.pickLists" />,
          perm: 'ui-agreements.picklists.view',
          route: 'pick-lists',
        },
        {
          component: PickListValueSettings,
          label: <FormattedMessage id="ui-agreements.settings.pickListValues" />,
          perm: 'ui-agreements.picklists.view',
          route: 'pick-list-values',
        },
      ]
    },
    {
      label: <FormattedMessage id="ui-agreements.settings.appSettings" />,
      pages: pageList,
    }
  ];

  if (isLoading) {
    return null;
  }

  return (
    <SettingsComponent
      pages={null} // Override the default pages implementation in favour of sections
      paneTitle={<FormattedMessage id="ui-agreements.meta.title" />}
      sections={sections}
      {...props}
    />
  );
};

export default ErmSettings;
