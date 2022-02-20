import { render } from '@testing-library/react';

import BlockcatCardComoponentLib from './blockcat-card-comoponent-lib';

describe('BlockcatCardComoponentLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BlockcatCardComoponentLib />);
    expect(baseElement).toBeTruthy();
  });
});
