import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import PinchZoomExample from "./PinchZoomExample";

export default {
  title: "Example/PinchZoomExample",
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof PinchZoomExample>;

const Template: ComponentStory<typeof PinchZoomExample> = (argv) => (
  <PinchZoomExample {...argv} />
);

export const Primary = Template.bind({});
