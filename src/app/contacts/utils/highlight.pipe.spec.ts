import { HighlightPipe } from './highlight.pipe';

describe('Highlight1Pipe', () => {
  it('create an instance', () => {
    const pipe = new HighlightPipe(null);
    expect(pipe).toBeTruthy();
  });
});
