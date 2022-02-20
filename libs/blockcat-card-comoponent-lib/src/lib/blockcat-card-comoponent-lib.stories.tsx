import { Story, Meta } from '@storybook/react';
import SidebarWithHeader from './blockcat-card-comoponent-lib';

export default {
  component: SidebarWithHeader,
  title: 'SidebarWithHeader',
} as Meta;

const Template: Story = () => (
  <SidebarWithHeader>123</SidebarWithHeader>
);

export const Primary = Template.bind({});
Primary.args = {};
