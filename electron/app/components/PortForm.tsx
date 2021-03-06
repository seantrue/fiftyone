import React, { useState } from "react";
import { Input, Label } from "semantic-ui-react";

export default ({ connected, port, setResult }) => {
  const [initialState] = useState({ port, connected });
  const [formState, setFormState] = useState({
    port: port,
    connected: connected,
    invalid: false,
  });

  const onChange = (event, input) => {
    if (isNaN(input.value)) {
      setFormState({
        ...formState,
        connected: false,
        invalid: true,
        port: input.value,
      });
      setResult(initialState);
    } else if (parseInt(input.value) <= 65535) {
      const socket = new WebSocket(`ws://localhost:${input.value}/state`);
      const tempFormState = {
        ...formState,
        connected: socket.readyState === WebSocket.OPEN,
        invalid: false,
        port: input.value,
      };
      setFormState(tempFormState);
      if (socket.readyState === WebSocket.OPEN) {
        setResult({ port: input.value, connected: true });
      }
    } else {
      setFormState({
        ...formState,
        connected: false,
        invalid: true,
        port: input.value,
      });
      setResult(initialState);
    }
  };

  return (
    <Input labelPosition="right" value={formState.port} onChange={onChange}>
      <input style={{ color: "black" }} />
      <Label>
        {formState.invalid
          ? "Invalid"
          : formState.connected
          ? "Connected!"
          : "Not connected"}
      </Label>
    </Input>
  );
};
