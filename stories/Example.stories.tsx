import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import Example from "./Example";

export default {
  title: "Example/Example",
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Example>;

const Template: ComponentStory<typeof Example> = (argv) => (
  <Example {...argv} />
);

export const Primary = Template.bind({});
