import { useState, useEffect } from 'react';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import { fetchTrainingData, fetchTrainingMetaDatum, fetchRemoveOutliers } from "./Client";
import { TrainingMetaDataList } from './TrainingMetaDataList';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation,
  LineController
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './style.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation,
  LineController,
);

function OutlierRemoval({ outliers_removed, setOutliers }) {
  const handleSubmitRemoveOutliers = (event) => {
    event.preventDefault();

    setOutliers(!outliers_removed)

  };

  return (
    <form onSubmit={e => handleSubmitRemoveOutliers(e)}>
      <Button type="submit" variant="primary">{outliers_removed ? 'Restore Outliers' : 'Remove Outliers'}</Button>
    </form>
  )
}

export function TrainingData({ training_id_1: training_id1 }) {

  const [altitude_plot, setAltitudePlot] = useState(undefined);
  const [cadence_plot, setCadencePlot] = useState(undefined);
  const [hr_plot, setHRPlot] = useState(undefined);
  const [speed_plot, setSpeedPlot] = useState(undefined);
  const [metadatum, setMetadatum] = useState(undefined);
  const [xminmax, setXMinMaxValue] = React.useState([0, 1]);
  const [xminmax_data, setXMinMaxDataValue] = React.useState([0, 1]);
  const [training_id2, setTrainingId2] = React.useState(undefined);
  const [outliers_removed, setOutliers] = useState(false);

  const setTrainingData = async (clientFunc) => {

    const getPlot = (plot_data, x_column_values, y_column_name, label, color) => {
      const colors = {
        1: {
          border: 'rgb(255, 99, 132)',
          background: 'rgba(255, 99, 132, 0.5)'
        },
        2: {
          border: 'rgb(99, 99, 255 )',
          background: 'rgba(99, 99, 255, 0.5)'
        }
      }
      const y_column_values = plot_data[y_column_name];
      const data_object = y_column_values.map((v, i) => { return { x: x_column_values[i], y: v } })

      return {
        label: label,
        indexAxis: 'x',
        type: 'line',
        parsing: false,
        data: data_object,
        borderColor: colors[color].border,
        backgroundColor: colors[color].background,
      }
    }

    const getPlots = async (training_id, plot_no) => {
      const data = await clientFunc(training_id);
      const distance = data.data.distance;
      console.log('getPlots data:')
      console.log(data)

      if (plot_no === 1) {
        setXMinMaxDataValue([Math.min(...distance), Math.max(...distance)]);
        setXMinMaxValue([Math.min(...distance), Math.max(...distance)]);
      }

      let plots = {};
      plots['altitude'] = getPlot(data.data, distance, 'altitude', `Session ${training_id}`, plot_no);
      if (meta.sport === 'RUNNING') plots['cadence'] = getPlot(data.data, distance, 'cadence', `Session ${training_id}`, plot_no);
      plots['hr'] = getPlot(data.data, distance, 'hr', `Session ${training_id}`, plot_no);
      plots['speed'] = getPlot(data.data, distance, 'speed', `Session ${training_id}`, plot_no);
      return plots;
    }

    const meta = await fetchTrainingMetaDatum(training_id1);
    setMetadatum(meta);
    const plots1 = await getPlots(training_id1, 1)
    console.log(`training_id2 !== undefined: ${training_id2 !== undefined}`)
    console.log(`training_id2 : ${training_id2}`)
    const plots2 = training_id2 !== undefined ? await getPlots(training_id2, 2) : undefined

    console.log(`plots2 === undefined: ${plots2 === undefined}`)
    console.log(`plots2: ${plots2}`)
    setAltitudePlot({
      datasets: plots2 === undefined ? [plots1.altitude] : [plots1.altitude, plots2.altitude]
    })
    meta.sport === 'RUNNING' && setCadencePlot({
      datasets: plots2 === undefined ? [plots1.cadence] : [plots1.cadence, plots2.cadence]
    })
    setHRPlot({
      datasets: plots2 === undefined ? [plots1.hr] : [plots1.hr, plots2.hr]
    })
    setSpeedPlot({
      datasets: plots2 === undefined ? [plots1.speed] : [plots1.speed, plots2.speed]
    })
  }

  useEffect(() => {
    setTrainingData(fetchTrainingData)
  }, []);

  useEffect(() => {
    setTrainingData(outliers_removed ? fetchRemoveOutliers : fetchTrainingData);
  }, [training_id2, outliers_removed]);

  const getPlotOptions = (y_title) => {
    return {
      parsing: false,
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        decimation: {
          enabled: true,
          //algorithm: 'lttb',
          algorithm: 'min-max',
          indexAxis: 'x',
          type: 'line',
          parsing: false,
          samples: 150,
          threshold: 200,
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: altitude_plot !== undefined && xminmax[0],
          max: altitude_plot !== undefined && xminmax[1],
          title: {
            display: true,
            text: 'Distance, m'
          }
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: y_title
          }
        }
      }
    }
  };

  const handleXMinMaxChange = (event, newValue) => {
    console.log(`newValue: ${newValue}`)
    setXMinMaxValue(newValue);
    console.log(`xminmax: ${xminmax}`)
  };


  function valuetext(value) {
    return `${value} m`;
  }

  return (
    <Container>
      <Row>
        <TrainingMetaDataList training_id={training_id1} />
      </Row>
      <Row>
        <Col sm>
          <OutlierRemoval outliers_removed={outliers_removed} setOutliers={setOutliers} />
        </Col>
        <Col sm>
          <Box sx={{ width: 300 }}>
            Select Distance Range
            <Slider
              getAriaLabel={() => 'Select Distance Range'}
              value={xminmax}
              onChange={handleXMinMaxChange}
              valueLabelDisplay="auto"
              valueLabelFormat={valuetext}
              min={xminmax_data[0]}
              max={xminmax_data[1]}
            />
          </Box>
        </Col>
      </Row>
      <Row>
        <Col sm className="chart-container">{altitude_plot !== undefined && <Line options={getPlotOptions('Altitude, m')} data={altitude_plot} />}</Col>
        <Col sm className="chart-container">{speed_plot !== undefined && <Line options={getPlotOptions('Speed, km/h')} data={speed_plot} />}</Col>
      </Row>
      <Row>
        <Col sm className="chart-container">{hr_plot !== undefined && <Line options={getPlotOptions('Heart Rate, bpm')} data={hr_plot} />}</Col>
        <Col sm className="chart-container">{cadence_plot !== undefined && <Line options={getPlotOptions('Cadence')} data={cadence_plot} />}</Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <b>Compare With Another Training Session</b>
        {console.log(`metadatum:`)}
        {console.log(metadatum)}
        {metadatum !== undefined && <TrainingMetaDataList
          sport={metadatum.sport}
          track_id={metadatum.track_id}
          exclude_training_id={training_id1}
          setTrainingDataView={setTrainingId2}
          active_training_id={training_id2}
          show_select={true} />}
      </Row>
    </Container>
  );
}
