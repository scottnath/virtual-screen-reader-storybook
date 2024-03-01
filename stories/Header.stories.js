import { createHeader } from './Header';
import { virtual } from '@guidepup/virtual-screen-reader';
import { expect } from '@storybook/test';

export default {
  title: 'Example/Header',
  tags: ['autodocs'],
  render: (args) => createHeader(args),
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

// Default LoggedIn story
export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
  // add the play method - it's where you put your tests!
  play: async ({ args, canvasElement, step }) => {
    // Start up the Virtual Screen Reader, giving it the canvasElement
    await virtual.start({ container: canvasElement });

    // This `while` statement navigates through the component using the 
    //  virtual screen reader to speak the text whereever the cursor is located.
    //  It will continue until it reaches the end of the <header> element, 
    //  which has a `banner` aria role, thus "end of banner"
    while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
      // `.next()` moves the Virtual cursor to the next location.
      await virtual.next();
    }

    // What we expect the screen reader to say
    const expected = [
      'banner',
      // it is an `<h1>`, so `level 1`
      'heading, Acme, level 1',
      'Welcome,',
      // Using `args` here allows you to change args without breaking the test
      args.user.name,
      '!',
      'button, Log out',
      'end of banner'
    ]

    // Here's the test! It asserts the screen reader said what we expected.
    //  When we called `lastSpokenPhrase` every time the `while` looped, 
    //  the spoken text was added to the `PhraseLog`, in order
    expect(await virtual.spokenPhraseLog()).toEqual(expected);
    
    // Stop your virtual screen reader instance
    await virtual.stop();
  }
};

export const LoggedOut = {
  play: async ({ args, canvasElement, step }) => {
    expect(canvasElement).toBeDefined();
    // example encapsulating in a `step`
    await step('Screen reader tests', async () => {
      await virtual.start({ container: canvasElement });
      while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
        await virtual.next();
      }
      const expected = [
        'banner',
        'heading, Acme, level 1',
        'button, Log in',
        'button, Sign up',
        'end of banner'
      ]
      expect(await virtual.spokenPhraseLog()).toEqual(expected);
      // Stop your virtual screen reader instance
      await virtual.stop();
    });
  }
};
