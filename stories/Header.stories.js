import { createHeader } from './Header';
import { virtual } from '@guidepup/virtual-screen-reader';
import { expect } from '@storybook/test';

export default {
  title: 'Example/Header',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args) => createHeader(args),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
  play: async ({ args, canvasElement, step }) => {
    expect(canvasElement).toBeDefined();
    await step('Screen reader tests', async () => {
      await virtual.start({ container: canvasElement });
      const spoken = []
      while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
        spoken.push(await virtual.lastSpokenPhrase())
        console.log('spoken', spoken[spoken.length - 1])
        await virtual.next();
      }
      const expected = [
        'banner',
        'heading, Acme, level 1',
        'Welcome,',
        args.user.name,
        '!',
        'button, Log out',
        'end of banner'
      ]
      expect(await virtual.spokenPhraseLog()).toEqual(expected);
      // Stop your virtual screen reader instance
      await virtual.stop();
    });
  }
};

export const LoggedOut = {
  play: async ({ args, canvasElement, step }) => {
    expect(canvasElement).toBeDefined();
  }
};
