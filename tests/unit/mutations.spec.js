import mutations from '../../src/store/mutations.js';

describe('mutations', () => {
  it('PushIndex sets currentIndex', () => {
    const state = { currentIndex: null };
    mutations.PushIndex(state, 5);
    expect(state.currentIndex).toBe(5);
  });
});
