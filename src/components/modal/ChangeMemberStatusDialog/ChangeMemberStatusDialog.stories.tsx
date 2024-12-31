import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ChangeMemberStatusDialog, {
  ChangeMemberStatusDialogProps,
} from './ChangeMemberStatusDialog.component';

export default {
  title: 'Modal/Change Member Status Dialog',
  component: ChangeMemberStatusDialog,
} as ComponentMeta<typeof ChangeMemberStatusDialog>;

const Template: ComponentStory<typeof ChangeMemberStatusDialog> = (
  args: ChangeMemberStatusDialogProps,
) => <ChangeMemberStatusDialog {...args} />;

export const changeMemberStatusDialog = Template.bind({});

changeMemberStatusDialog.args = {};
