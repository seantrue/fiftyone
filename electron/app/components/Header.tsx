import React from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { useRecoilValue, useRecoilState } from "recoil";

import ExternalLink from "./ExternalLink";
import * as atoms from "../recoil/atoms";
import * as selectors from "../recoil/selectors";
import logo from "../logo.png";
import { GitHub, MenuBook } from "@material-ui/icons";
import { Slack } from "../icons";

const HeaderDiv = styled.div`
  background-color: ${({ theme }) => theme.backgroundDark};
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px ${({ theme }) => theme.backgroundDarkBorder} solid;
`;

const LogoDiv = styled.div`
  height: 40px;
  margin: 1rem;
`;

const LogoWrapper = styled.div`
  height: 100%;
  margin-top: 2px;
  padding: 0.25rem 1rem 0.25rem 0;
  border-right-width: 1px;
  border-color: ${({ theme }) => theme.backgroundDarkBorder};
  border-right-style: solid;
`;

const LogoImg = animated(styled.img`
  height: 100%;
  width: auto;
  cursor: pointer;
`);

const LeftDiv = styled.div`
  display: flex;
`;

const RightDiv = styled.div`
  margin-left: auto;
  padding-right: 0.5rem;
`;

const TitleDiv = styled.div`
  padding: 0.5rem 0;
`;

const FiftyOneDiv = styled.div`
  color: ${(theme) => theme.font};
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1.5;
`;

const DatasetDiv = styled.div`
  line-height: 1;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 0.5em;
  }

  svg:focus {
    outline: none;
  }
`;

const Header = () => {
  const datasetNameValue = useRecoilValue(selectors.datasetName);
  const [showGlobalNav, setShowGlobalNav] = useRecoilState(atoms.showGlobalNav);

  const logoProps = useSpring({
    transform: showGlobalNav ? `rotate(0turn)` : `rotate(1turn)`,
  });

  return (
    <HeaderDiv>
      <LeftDiv>
        <LogoDiv>
          <LogoWrapper>
            <LogoImg
              style={logoProps}
              onClick={() => setShowGlobalNav(!showGlobalNav)}
              src={logo}
            />
          </LogoWrapper>
        </LogoDiv>
        <TitleDiv>
          <FiftyOneDiv>FiftyOne</FiftyOneDiv>
          <DatasetDiv>
            {datasetNameValue ? datasetNameValue : "NO DATASET LOADED"}
          </DatasetDiv>
        </TitleDiv>
      </LeftDiv>
      <RightDiv>
        <IconWrapper>
          <ExternalLink
            title="Slack"
            href="https://join.slack.com/t/fiftyone-users/shared_invite/zt-gtpmm76o-9AjvzNPBOzevBySKzt02gg"
          >
            <Slack />
          </ExternalLink>
          <ExternalLink
            title="GitHub"
            href="https://github.com/voxel51/fiftyone"
          >
            <GitHub />
          </ExternalLink>
          <ExternalLink
            title="Documentation"
            href="https://voxel51.com/docs/fiftyone/user_guide/app.html"
          >
            <MenuBook />
          </ExternalLink>
        </IconWrapper>
      </RightDiv>
    </HeaderDiv>
  );
};

export default Header;
