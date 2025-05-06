import React from "react";
import HelloWord from "@/components/HellowWord.tsx";

export const createReactHelloWorldComponent = () => {
  return React.createElement(HelloWord, { message: 'React component' });
}
