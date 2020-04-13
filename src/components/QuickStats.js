import React from 'react'
import { 
  Card, 
  Segment,
  Dimmer,
  Loader,
  Image,
  Statistic,
} from 'semantic-ui-react'
import ErrorBoundary from "react-error-boundary";
import {
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
} from 'recharts';


function CustomizedAxisTick(props){
  const {
    x, y, payload,
  } = props;

  const tokens = payload.value.split('-');
  const time = tokens[1]+'/'+tokens[2]+'/'+tokens[0].substring(2,4);

  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={8} 
        fontSize='0.75em'
        textAnchor="end" 
        fill="#666" 
        transform="rotate(-30)">{time}
      </text>
    </g>
  );
}

export default function QuickStats(props) {

  if (!props.counts) {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>

        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      </Segment>
    )
  }

  return (
    <ErrorBoundary>
      <Card.Group>
        <Card style={{minWidth: '350px', boxShadow: '0 0'}}>
          <Card.Content style={{textAlign: 'center'}}>
            <Statistic.Group horizontal size='mini' style={{alignItems:'center'}}>
              <Statistic>
                <Statistic.Value>{Math.round(props.stats.au)}</Statistic.Value>
                <Statistic.Label>active members/day</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Card.Meta content="# of members w/ any RPM Activities"/>
            <AreaChart
                width={300}
                height={150}
                data={props.counts.au}
                margin={{
                  top: 20, right: 0, left: 0, bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='time' tick={<CustomizedAxisTick />}/>
                <YAxis />
                <Tooltip />
                  <Area type="monotone" dataKey="value" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
          </Card.Content>
        </Card>
        <Card style={{minWidth: '350px', boxShadow: '0 0'}}>
          <Card.Content style={{textAlign: 'center'}}>
            <Statistic.Group horizontal size='mini' style={{alignItems:'center'}}>
              <Statistic>
                <Statistic.Value>{Math.round(props.stats.bw)}</Statistic.Value>
                <Statistic.Label>weight measures/day</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Card.Meta content="# of weight measures"/>
            <AreaChart
                width={300}
                height={150}
                data={props.counts.bw}
                margin={{
                  top: 20, right: 0, left: 0, bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='time' tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                  <Area type="monotone" dataKey="value" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
          </Card.Content>
        </Card>
        <Card style={{minWidth: '350px', boxShadow: '0 0'}}>
          <Card.Content style={{textAlign: 'center'}}>
            <Statistic.Group horizontal size='mini' style={{alignItems:'center'}}>
              <Statistic>
                <Statistic.Value>{Math.round(props.stats.bp)}</Statistic.Value>
                <Statistic.Label>BP measures/day</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Card.Meta content="# of blood pressure measures"/>
            <AreaChart
                width={300}
                height={150}
                data={props.counts.bp}
                margin={{
                  top: 20, right: 0, left: 0, bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='time'  tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                  <Area type="monotone" dataKey="value" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
          </Card.Content>
        </Card>
      </Card.Group>
    </ErrorBoundary>
  )

}