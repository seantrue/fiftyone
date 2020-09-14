import React, { useState, useEffect, useRef, useContext } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled, { ThemeContext } from "styled-components";

import { Grid, Sticky } from "semantic-ui-react";

import DisplayOptionsSidebar from "../components/DisplayOptionsSidebar";
import ImageContainerHeader from "../components/ImageContainerHeader";
import Samples from "../components/Samples";
import ViewBar from "../components/ViewBar/ViewBar";

import * as atoms from "../recoil/atoms";
import * as selectors from "../recoil/selectors";
import { useResizeHandler, useScrollHandler } from "../utils/hooks";
import { makeLabelNameGroups } from "../utils/labels";

const Root = styled.div`
  .ui.grid > .sidebar-column {
    flex: 0 0 17rem;
    z-index: 400;
    margin-right: -0.5em;
  }

  .ui.grid > .content-column {
    flex: 1;
  }
`;

const DisplayOptionsWrapper = (props) => {
  const {
    containerRef,
    sidebarRef,
    sidebarHeight,
    displayProps,
    headerHeight,
  } = props;
  const {
    activeTags,
    activeLabels,
    activeOther,
    setActiveTags,
    setActiveLabels,
    setActiveOther,
  } = displayProps;
  const labelSampleCounts = useRecoilValue(selectors.labelSampleCounts);
  const tagNames = useRecoilValue(selectors.tagNames);
  const tagSampleCounts = useRecoilValue(selectors.tagSampleCounts);
  const filters = useRecoilValue(selectors.labelFilters);
  const setModalFilters = useSetRecoilState(selectors.modalLabelFilters);

  const fieldSchema = useRecoilValue(selectors.fieldSchema);
  const labelNames = useRecoilValue(selectors.labelNames);
  const labelTypes = useRecoilValue(selectors.labelTypes);

  useEffect(() => {
    setModalFilters(filters);
  }, [filters]);

  const getDisplayOptions = (values, counts, selected) => {
    return [...values].sort().map(({ name, type }) => ({
      name,
      type,
      count: counts[name],
      selected: Boolean(selected[name]),
    }));
  };
  const handleSetDisplayOption = (setSelected) => (entry) => {
    setSelected((selected) => ({
      ...selected,
      [entry.name]: entry.selected,
    }));
  };

  const labelNameGroups = makeLabelNameGroups(
    fieldSchema,
    labelNames,
    labelTypes
  );

  return (
    <Grid.Column className="sidebar-column">
      <DisplayOptionsSidebar
        tags={getDisplayOptions(
          tagNames.map((t) => ({ name: t })),
          tagSampleCounts,
          activeTags
        )}
        labels={getDisplayOptions(
          labelNameGroups.labels,
          labelSampleCounts,
          activeLabels
        )}
        onSelectTag={handleSetDisplayOption(setActiveTags)}
        onSelectLabel={handleSetDisplayOption(setActiveLabels)}
        scalars={getDisplayOptions(
          labelNameGroups.scalars,
          labelSampleCounts,
          activeOther
        )}
        onSelectScalar={handleSetDisplayOption(setActiveOther)}
        unsupported={getDisplayOptions(
          labelNameGroups.unsupported,
          labelSampleCounts,
          activeLabels
        )}
        style={{
          maxHeight: sidebarHeight,
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 25,
          marginRight: -25,
          scrollbarWidth: "thin",
        }}
        ref={sidebarRef}
      />
    </Grid.Column>
  );
};

const SamplesContainer = (props) => {
  const [showSidebar, setShowSidebar] = useRecoilState(atoms.sidebarVisible);
  const datasetName = useRecoilValue(selectors.datasetName);
  const numSamples = useRecoilValue(selectors.numSamples);
  const theme = useContext(ThemeContext);

  const containerRef = useRef();
  const stickyHeaderRef = useRef();
  const sidebarRef = useRef();
  const [sidebarHeight, setSidebarHeight] = useState("unset");
  let headerHeight = 0;
  if (stickyHeaderRef.current && stickyHeaderRef.current.stickyRect) {
    headerHeight = stickyHeaderRef.current.stickyRect.height;
  }
  const updateSidebarHeight = () => {
    if (sidebarRef.current) {
      setSidebarHeight(
        window.innerHeight - sidebarRef.current.getBoundingClientRect().top
      );
    }
  };
  useResizeHandler(updateSidebarHeight, [sidebarRef.current]);
  useScrollHandler(updateSidebarHeight, [sidebarRef.current]);
  useEffect(updateSidebarHeight, []);

  return (
    <Root ref={containerRef} showSidebar={showSidebar}>
      <ViewBar />
      <ImageContainerHeader
        datasetName={datasetName}
        total={numSamples}
        showSidebar={showSidebar}
        onShowSidebar={setShowSidebar}
      />
      <Grid>
        {showSidebar ? (
          <DisplayOptionsWrapper
            sidebarRef={sidebarRef}
            stickyHeaderRef={stickyHeaderRef}
            containerRef={containerRef}
            sidebarHeight={sidebarHeight}
            headerHeight={headerHeight}
            {...props}
          />
        ) : null}
        <Grid.Column className="content-column">
          <Samples {...props} />
        </Grid.Column>
      </Grid>
    </Root>
  );
};

export default SamplesContainer;
