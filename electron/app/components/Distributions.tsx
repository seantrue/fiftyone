import React, { useState, useEffect, useRef, PureComponent } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip } from "recharts";
import { Header, Loader, Segment } from "semantic-ui-react";

import { updateState } from "../actions/update";
import { getSocket, useSubscribe } from "../utils/socket";
import connect from "../utils/connect";

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload, fill } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={fill}
          transform="rotate(-80)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

const Distribution = connect(({ data, name }) => {
  const barWidth = 30;
  const [rightMargin, setRightMargin] = useState(0);
  const container = useRef(null);
  const stroke = "hsl(210, 20%, 90%)";
  const fill = stroke;

  return (
    <Segment style={{ overflowY: "auto", margin: "2rem" }}>
      <Header as="h3">{name}</Header>
      <BarChart
        ref={container}
        height={500}
        width={data.length * (barWidth + 20 + 36.5)}
        barCategoryGap={"20px"}
        data={data}
        margin={{ top: 0, left: 0, bottom: 0, right: rightMargin + 5 }}
      >
        <XAxis
          dataKey="key"
          type="category"
          interval={0}
          height={100}
          axisLine={false}
          tick={<CustomizedAxisTick {...{ fill }} />}
          tickLine={{ stroke }}
        />
        <YAxis
          dataKey="count"
          axisLine={false}
          tick={{ fill }}
          tickLine={{ stroke }}
        />
        <Tooltip />
        <Bar dataKey="count" fill="rgb(255, 109, 4)" barSize={barWidth} />
      </BarChart>
    </Segment>
  );
});

const Distributions = ({ group, port, state }) => {
  const socket = getSocket(port, "state");
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = () => {
    socket.emit("get_distributions", group, (data) => {
      setInitialLoad(false);
      setLoading(false);
      setData(data);
    });
  };

  if (initialLoad) {
    getData();
  }

  useSubscribe(socket, "update", (data) => {
    setLoading(true);
    getData();
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {data.map((dist, i) => {
        return <Distribution key={i} data={dist.data} name={chart._id} />;
      })}
    </>
  );
};

export default connect(Distributions);
