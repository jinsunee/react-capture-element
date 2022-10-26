import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import CaptureElementExample from "./CaptureElementExample";

export default {
  title: "Example/CaptureElementExample",
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof CaptureElementExample>;

const Template: ComponentStory<typeof CaptureElementExample> = (argv) => (
  <CaptureElementExample {...argv} />
);

export const Primary = Template.bind({});
