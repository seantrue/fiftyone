import React from "react";
import styled from "styled-components";
import { config, animated, useSpring } from "react-spring";
import * as atoms from "../recoil/atoms";
import { useRecoilValue } from "recoil";

const GlobalNavContainer = animated(styled.div`
  display: block;
  height: 100%;
`);

const GlobalNav = () => {
  const showGlobalNav = useRecoilValue(atoms.showGlobalNav);
  const props = useSpring({
    width: showGlobalNav ? 500 : 0,
    from: {
      width: 0,
    },
    config: config.gentle,
  });
  return <GlobalNavContainer style={props}></GlobalNavContainer>;
};

export default GlobalNav;
