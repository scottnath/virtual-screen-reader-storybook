POC: Virtual Screen Reader in Storybook
---

This proof of concept shows [Virtual Screen Reader](https://github.com/guidepup/virtual-screen-reader) working with a default HTML/Vite setup of Storybook from [Storybook.new](https://storybook.new) ([original storybook source repo](https://github.com/storybookjs/sandboxes/tree/next/html-vite/default-js)). This was made to show a working version in response to [a VSR issue about ESM requirements](https://github.com/guidepup/virtual-screen-reader/issues/49).

See article for details:

**[Simple setup: Virtual Screen Reader in Storybook](https://scottnath.com/blahg/virtual-screen-reader-with-storybook/)**

## Working example

* GitHub: https://github.com/scottnath/virtual-screen-reader-storybook
* StackBlitz dev env: https://stackblitz.com/~/github.com/scottnath/virtual-screen-reader-storybook

### Stackblitz note

Open the running storybook site in a new tab or window - otherwise the Interaction tests intermittently don't show up.

## Modifications from default Storybook install

### Install `virtual-screen-reader`

Obvious, I know, but ¯\_(ツ)_/¯

`npm i @guidepup/virtual-screen-reader`

### Include in a play test

See [./stories/Header.stories.js](./stories/Header.stories.js)

```js
import { virtual } from '@guidepup/virtual-screen-reader';
import { expect } from '@storybook/test';

...

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
  play: async ({ args, canvasElement, step }) => {
    await virtual.start({ container: canvasElement });
    while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
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
    await virtual.stop();
  }
};
```