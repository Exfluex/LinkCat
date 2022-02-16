import { Story, Meta } from '@storybook/react';
import {
  CardRenderComponent,
  CardRenderComponentProps,
} from './card-render-component';

export default {
  component: CardRenderComponent,
  title: 'CardRenderComponent',
} as Meta;

const Template: Story<CardRenderComponentProps> = (args) => (
  <CardRenderComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
