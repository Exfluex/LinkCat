import { render } from '@testing-library/react';

import CardRenderComponent from './card-render-component';

describe('CardRenderComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardRenderComponent />);
    expect(baseElement).toBeTruthy();
  });
});
