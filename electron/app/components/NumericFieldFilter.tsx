import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import * as atoms from "../recoil/atoms";
import * as selectors from "../recoil/selectors";
import { NamedRangeSlider } from "./RangeSlider";
import { animated, useSpring } from "react-spring";
import useMeasure from "react-use-measure";
import { packageMessage } from "../utils/socket";

const makeFilter = (fieldName, range, includeNone, isDefaultRange) => {
  let expr,
    rangeExpr = null;
  let fieldStr = `$${fieldName}`;
  if (!isDefaultRange) {
    rangeExpr = {
      $and: [{ $gte: [fieldStr, range[0]] }, { $lte: [fieldStr, range[1]] }],
    };
  }
  if (!includeNone && isDefaultRange) {
    expr = { [fieldName]: { $exists: true, $ne: null } };
  } else if (includeNone && !isDefaultRange) {
    expr = {
      $expr: {
        $or: [rangeExpr, { $eq: [{ $ifNull: [fieldStr, null] }, null] }],
      },
    };
  } else {
    expr = { $expr: rangeExpr };
  }
  return {
    kwargs: [["filter", expr]],
    _cls: "fiftyone.core.stages.Match",
  };
};

const NumericFieldFilter = ({ expanded, entry }) => {
  const socket = useRecoilValue(selectors.socket);
  const boundsAtom = selectors.numericFieldBounds(entry.path);
  const rangeAtom = atoms.filterNumericFieldRange(entry.path);
  const includeNoneAtom = atoms.filterNumericFieldIncludeNone(entry.path);
  const [includeNone, setIncludeNone] = useRecoilState(includeNoneAtom);
  const [stateDescription, setStateDescription] = useRecoilState(
    atoms.stateDescription
  );
  const bounds = useRecoilValue(boundsAtom);
  const [range, setRange] = useRecoilState(rangeAtom);
  const hasBounds = bounds.every((b) => b !== null);
  const [overflow, setOverflow] = useState("hidden");
  const [localBounds, setLocalBounds] = useState([null, null]);
  const isDefaultRange = range[0] === bounds[0] && range[1] === bounds[1];
  const filterStage = useRecoilValue(selectors.filterStage(entry.path));

  useEffect(() => {
    if (filterStage) return;
    setIncludeNone(true);
    setRange(bounds);
  }, [filterStage]);
  useEffect(() => {
    localBounds.some((b, i) => b !== bounds[i]) && setRange(bounds);
  }, [bounds, localBounds]);
  useEffect(() => {
    if (!hasBounds) {
      return;
    }
    setLocalBounds(bounds);
    if (localBounds.some((b, i) => b !== bounds[i] && b !== null)) {
      setRange([...bounds]);
    }
  }, [bounds]);

  useEffect(() => {
    const newState = JSON.parse(JSON.stringify(stateDescription));
    if (range.every((e) => e === null)) return;
    if (includeNone && isDefaultRange && !(entry.path in newState.filters))
      return;
    const filter = makeFilter(entry.name, range, includeNone, isDefaultRange);
    if (JSON.stringify(filter) === JSON.stringify(newState.filters[entry.path]))
      return;
    if (isDefaultRange && includeNone && newState.filters[entry.path]) {
      delete newState.filters[entry.path];
    } else {
      newState.filters[entry.path] = filter;
    }
    if (!hasBounds) return;
    socket.send(
      packageMessage("update", {
        state: newState,
      })
    );
    setStateDescription(newState);
  }, [range, includeNone]);

  const [ref, { height }] = useMeasure();
  const props = useSpring({
    height: expanded ? height : 0,
    from: {
      height: 0,
    },
    onStart: () => !expanded && setOverflow("hidden"),
    onRest: () => expanded && setOverflow("visible"),
  });

  return (
    <animated.div style={{ ...props, overflow }}>
      <NamedRangeSlider
        color={entry.color}
        name={"Range"}
        valueName={"value"}
        includeNoneAtom={includeNoneAtom}
        boundsAtom={boundsAtom}
        rangeAtom={rangeAtom}
        ref={ref}
      />
    </animated.div>
  );
};

export default NumericFieldFilter;
