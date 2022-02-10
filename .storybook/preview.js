import { addDecorator } from '@storybook/react';
import { Global, ThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import { theme, globalStyles } from '@/styles';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator((Story) => (
  <RecoilRoot>
    <Global styles={globalStyles} />
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  </RecoilRoot>
));
