import React, { useContext, useEffect, useRef, useMemo } from "react";
import styled, { ThemeContext } from "styled-components";
import { animated, useSpring } from "react-spring";
import { useRecoilValue } from "recoil";
import { useService } from "@xstate/react";
import AuosizeInput from "react-input-autosize";

import SearchResults from "./SearchResults";
import ViewStageParameter from "./ViewStageParameter";
import ViewStageStories from "./ViewStage.stories";

const ViewStageContainer = styled.div`
  margin: 0.5rem 0.25rem;
  display: inline-block;
`;

const ViewStageDiv = animated(styled.div`
  box-sizing: border-box;
  border: 2px dashed ${({ theme }) => theme.brand};
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-right-width: 0;
  display: inline-block;
  position: relative;
`);

const ViewStageInput = styled(AuosizeInput)`
  & > input {
    background-color: transparent;
    border: none;
    margin: 0.5rem;
    color: ${({ theme }) => theme.font};
    line-height: 1rem;
    border: none;
  }

  & > input:focus {
    boder: none;
    outline: none;
  }

  & ::placeholder {
    color: ${({ theme }) => theme.font};
  }
`;

export const ViewStageButton = animated(styled.button`
  box-sizing: border-box;
  border: 2px dashed ${({ theme }) => theme.brand};
  color: ${({ theme }) => theme.font};
  border-radius: 3px;
  display: inline-block;
  position: relative;
  margin: 0.25rem;
  line-height: 1rem;
  padding: 0.5rem;
  cursor: pointer;

  :focus {
    outline: none;
  }
`);

export const AddViewStage = React.memo(({ send, insertAt }) => {
  const theme = useContext(ThemeContext);
  const [props, set] = useSpring(() => ({
    background: theme.brandMoreTransparent,
    opacity: 1,
    from: {
      opacity: 0,
    },
  }));

  return (
    <ViewStageButton
      style={props}
      onMouseEnter={() => set({ background: theme.brandTransparent })}
      onMouseLeave={() => set({ background: theme.brandMoreTransparent })}
      onClick={() => send({ type: "STAGE.ADD", insertAt })}
    >
      +
    </ViewStageButton>
  );
});

const DeleteViewStageButton = animated(styled.div`
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border-left: 2px solid ${({ theme }) => theme.brand};
  border-color: ${({ theme }) => theme.brand};
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
`);

const DeleteViewStage = React.memo(({ send, spring }) => {
  return (
    <DeleteViewStageButton style={spring} onClick={() => send("STAGE.DELETE")}>
      x
    </DeleteViewStageButton>
  );
});

const ViewStage = React.memo(({ stageRef }) => {
  const theme = useContext(ThemeContext);
  const [state, send] = useService(stageRef);
  const inputRef = useRef(null);

  const { id, stage, stageInfo, parameters } = state.context;

  const isCompleted = ["reading.selected", "reading.submitted"].some(
    state.matches
  );

  const deleteProps = useSpring({
    borderStyle: isCompleted ? "solid" : "dashed",
    borderBottomRightRadius: isCompleted ? 0 : 3,
    backgroundColor: isCompleted
      ? theme.brandTransparent
      : theme.brandMoreTransparent,
  });

  const props = useSpring({
    borderStyle: isCompleted ? "solid" : "dashed",
    backgroundColor: isCompleted
      ? theme.brandTransparent
      : theme.brandMoreTransparent,
    opacity: 1,
    from: {
      opacity: 0,
    },
  });

  const actionsMap = useMemo(
    () => ({
      focusInput: () => inputRef.current && inputRef.current.select(),
      blurInput: () => inputRef.current && inputRef.current.blur(),
    }),
    []
  );

  useEffect(() => {
    const listener = (state) => {
      state.actions.forEach((action) => {
        if (action.type in actionsMap) actionsMap[action.type]();
      });
    };
    stageRef.onTransition(listener);
    return () => stageRef.listeners.delete(listener);
  }, []);

  return (
    <ViewStageContainer>
      <ViewStageDiv style={props}>
        <ViewStageInput
          placeholder="+ search sample"
          value={stage}
          onFocus={() => !state.matches("editing") && send("EDIT")}
          onBlur={() =>
            state.matches("editing.searchResults.notHovering") && send("BLUR")
          }
          onChange={(e) => send({ type: "CHANGE", stage: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              send({ type: "COMMIT", stage: e.target.value });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              send("BLUR");
            }
          }}
          style={{ fontSize: "1rem" }}
          ref={inputRef}
        />
        {state.matches("editing") && (
          <SearchResults
            results={stageInfo
              .map((s) => s.name)
              .filter((n) => n.toLowerCase().includes(stage.toLowerCase()))}
            send={send}
          />
        )}
      </ViewStageDiv>
      {isCompleted &&
        parameters.map((parameter) => (
          <ViewStageParameter key={parameter.id} parameterRef={parameter.ref} />
        ))}
      <DeleteViewStage spring={deleteProps} send={send} />
    </ViewStageContainer>
  );
});

export default ViewStage;
