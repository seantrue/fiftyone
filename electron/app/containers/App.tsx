import { remote, ipcRenderer } from "electron";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { ErrorBoundary } from "react-error-boundary";

import Header from "../components/Header";

import { updateState, updateConnected, updateLoading } from "../actions/update";
import { getSocket, useSubscribe } from "../utils/socket";
import connect from "../utils/connect";
import { stateDescription, selectedSamples } from "../recoil/atoms";
import gaConfig from "../constants/ga.json";
import Error from "./Error";
import GlobalNav from "../components/GlobalNav";

type Props = {
  children: ReactNode;
};

const AppContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const MainBody = styled.div`
  flex-grow: 1;
`;

function App(props: Props) {
  const [showInfo, setShowInfo] = useState(true);
  const [reset, setReset] = useState(false);
  const { loading, children, dispatch, connected, port } = props;
  const portRef = useRef();
  const [result, setResultFromForm] = useState({ port, connected });
  const [socket, setSocket] = useState(getSocket(result.port, "state"));
  const setStateDescription = useSetRecoilState(stateDescription);
  const setSelectedSamples = useSetRecoilState(selectedSamples);

  const handleStateUpdate = (data) => {
    setStateDescription(data);
    setSelectedSamples(new Set(data.selected));
    dispatch(updateState(data));
  };

  const [gaInitialized, setGAInitialized] = useState(false);
  useEffect(() => {
    const dev = process.env.NODE_ENV == "development";
    const buildType = dev ? "dev" : "prod";
    socket.emit("get_fiftyone_info", (info) => {
      ReactGA.initialize(gaConfig.app_ids[buildType], {
        debug: dev,
        gaOptions: {
          storage: "none",
          cookieDomain: "none",
          clientId: info.user_id,
        },
      });
      ReactGA.set({
        userId: info.user_id,
        checkProtocolTask: null, // disable check, allow file:// URLs
        [gaConfig.dimensions.dev]: buildType,
        [gaConfig.dimensions.version]: info.version,
      });
      setGAInitialized(true);
      ReactGA.pageview(window.location.hash.replace(/^#/, ""));
    });
  }, []);
  useEffect(() => {
    if (gaInitialized) {
      ReactGA.pageview(window.location.hash.replace(/^#/, ""));
    }
  }, [window.location.hash]);
  useSubscribe(socket, "connect", () => {
    dispatch(updateConnected(true));
    if (loading) {
      socket.emit("get_current_state", "", (data) => {
        handleStateUpdate(data);
        dispatch(updateLoading(false));
      });
    }
  });
  if (socket.connected && !connected) {
    dispatch(updateConnected(true));
    dispatch(updateLoading(true));
    socket.emit("get_current_state", "", (data) => {
      handleStateUpdate(data);
      dispatch(updateLoading(false));
    });
  }
  setTimeout(() => {
    if (loading && !connected) {
      dispatch(updateLoading(false));
    }
  }, 250);
  useSubscribe(socket, "disconnect", () => {
    dispatch(updateConnected(false));
  });
  useSubscribe(socket, "update", (data) => {
    if (data.close) {
      remote.getCurrentWindow().close();
    }
    handleStateUpdate(data);
  });

  useEffect(() => {
    if (reset) {
      socket.emit("get_current_state", "", (data) => {
        handleStateUpdate(data);
        dispatch(updateLoading(false));
      });
    }
  }, [reset]);

  ipcRenderer.on("update-session-config", (event, message) => {
    portRef.current.ref.current.click();
  });
  const bodyStyle = {
    padding: "0 2rem 2rem 2rem",
  };

  return (
    <ErrorBoundary
      FallbackComponent={Error}
      onReset={() => setReset(true)}
      resetKeys={[reset]}
    >
      <AppContainer>
        <GlobalNav />
        <MainBody>
          <Header />
          <div className={showInfo ? "" : "hide-info"} style={bodyStyle}>
            {children}
          </div>
        </MainBody>
      </AppContainer>
    </ErrorBoundary>
  );
}

export default connect(App);
