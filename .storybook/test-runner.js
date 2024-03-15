import { getStoryContext } from '@storybook/test-runner';

const config = {
  tags: {
    include: ['a11y'],
  },
  async preVisit(page, story) {
    const ctx = await getStoryContext(page, story);
    console.log('preVisit context', ctx);
  },
  async postVisit(page, story) {
    const ctx = await getStoryContext(page, story);
    console.log('postVisit context', ctx);
  },
};
export default config;