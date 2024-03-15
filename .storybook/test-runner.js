import { getStoryContext } from '@storybook/test-runner';

const config = {
  tags: {
    include: ['a11y'],
  },
  async postVisit(page, story) {
    const ctx = await getStoryContext(page, story);
    console.log('story context', ctx);
  },
};
export default config;