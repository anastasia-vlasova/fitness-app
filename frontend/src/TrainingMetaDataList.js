import { useState, useEffect, React } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchTrainingMetaData, fetchDeleteTrainingData } from './Client';
import Alert from 'react-bootstrap/Alert'
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


function TrainingMetaDataItem({
  item: i,
  setTrainingDataView,
  show_delete,
  show_select,
  show_open,
  toggleMetadataUpdate,
  metadata_update_toggle,
  is_disabled
}) {

  const [is_active, setIsActive] = useState(false);

  const handleDelete = async () => {
    const data = await fetchDeleteTrainingData(i.id)
    console.log(data);
    toggleMetadataUpdate(!metadata_update_toggle);
  }

  return (
    <tr>
      <td>{i.date}</td>
      <td className="d-none d-lg-table-cell">{i.start_time}</td>
      <td className="d-none d-lg-table-cell">{i.duration}</td>
      <td>{i.distance}</td>
      <td>{i.average_hr}</td>
      <td>{i.average_speed}</td>
      <td className="d-none d-lg-table-cell">{i.max_speed}</td>
      <td className="d-none d-lg-table-cell">{i.average_pace}</td>
      <td className="d-none d-lg-table-cell">{i.max_pace}</td>
      <td className="d-none d-lg-table-cell">{i.calories}</td>
      <td className="d-none d-lg-table-cell"> {i.fat_percentage}</td>
      {i.sport === 'RUNNING' && <td className="d-none d-lg-table-cell">{i.average_cadence}</td>}
      {i.sport === 'RUNNING' && <td className="d-none d-lg-table-cell">{i.running_index}</td>}
      <td className="d-none d-lg-table-cell">{i.training_load}</td>
      <td className="d-none d-lg-table-cell">{i.ascent}</td>
      <td className="d-none d-lg-table-cell">{i.descent}</td>
      <td className="d-none d-lg-table-cell">{i.track_id}</td>
      {show_open &&
        <td>
          <Tooltip title='Open'>
            <IconButton onClick={
              () => {
                is_active ? setTrainingDataView(undefined) : setTrainingDataView(i.id); setIsActive(!is_active)
              }
            }>
              <OpenInBrowserOutlinedIcon />
            </IconButton>
          </Tooltip>
        </td>}
      {show_select &&
        <td>
          <Tooltip title={is_active ? 'Stop comparing' : 'Select to compare'}>
            <IconButton disabled={is_disabled} onClick={
              () => {
                is_active ? setTrainingDataView(undefined) : setTrainingDataView(i.id); setIsActive(!is_active)
              }
            }>
              <DoneOutlineOutlinedIcon color={is_active ? "success" : "action"} />
            </IconButton>
          </Tooltip>
        </td>}
      {show_delete && <td>
        <Tooltip title='Delete'>
          <IconButton onClick={e => handleDelete(e)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </td>}
    </tr>
  );

}

export function TrainingMetaDataList({
  setTrainingDataView,
  sport,
  track_id,
  training_id,
  metadata_update_toggle,
  toggleMetadataUpdate,
  exclude_training_id,
  active_training_id,
  show_delete,
  show_select,
  show_open
}) {
  const [metadata, setMetadata] = useState(undefined);


  const setUpdatedMetadata = async () => {
    if (track_id !== '') {
      const data = await fetchTrainingMetaData(sport, track_id, training_id);
      setMetadata(data);
    }
  };

  useEffect(() => {
    setUpdatedMetadata();
  }, [sport, metadata_update_toggle]);

  useEffect(() => {
    setUpdatedMetadata();
  }, []);

  return (
    <div>
      {metadata !== undefined && (exclude_training_id === undefined ? metadata.length !== 0 : metadata.length > 1) //
        ? // then 0
        <Table striped bordered hover size="sm my-2">
          {console.log('metadata:')}
          {console.log(metadata)}

          <thead>
            <tr>
              <th style={{ verticalAlign: 'top' }}>Date</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Start time</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Duration</th>
              <th style={{ verticalAlign: 'top' }}>Distance</th>
              <th style={{ verticalAlign: 'top' }}>Average HR</th>
              <th style={{ verticalAlign: 'top' }}>Average Speed</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Max Speed</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Average Pace</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Max Pace</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Calories</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Fat Percentage</th>
              {
                ((Array.isArray(metadata) && metadata[0].sport === 'RUNNING') || (!Array.isArray(metadata) && metadata.sport === 'RUNNING'))
                && <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Average Cadence</th>
              }
              {
                ((Array.isArray(metadata) && metadata[0].sport === 'RUNNING') || (!Array.isArray(metadata) && metadata.sport === 'RUNNING'))
                && <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Running Index</th>
              }
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Training Load</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Ascent</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Descent</th>
              <th style={{ verticalAlign: 'top' }} className="d-none d-lg-table-cell">Track Id</th>
              {show_open && <th></th>}
              {show_select && <th></th>}
              {show_delete && <th></th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(metadata)  // if 1
              ? metadata.map((item) => (exclude_training_id !== item.id // then 1 if 2
                && <TrainingMetaDataItem // then 2
                  item={item}
                  setTrainingDataView={setTrainingDataView}
                  show_delete={show_delete}
                  show_select={show_select}
                  show_open={show_open}
                  toggleMetadataUpdate={toggleMetadataUpdate}
                  metadata_update_toggle={metadata_update_toggle}
                  is_disabled={active_training_id !== undefined &&active_training_id !== item.id}
                />))
              : exclude_training_id !== metadata.id // else 1 if 3
              && <TrainingMetaDataItem // then 2
                item={metadata}
                setTrainingDataView={setTrainingDataView}
                show_delete={show_delete}
                show_select={show_select}
                show_open={show_open}
                toggleMetadataUpdate={toggleMetadataUpdate}
                metadata_update_toggle={metadata_update_toggle}
                is_disabled={false}
              />}
          </tbody>
        </Table>
        : // else 0
        <Alert key="info" variant="info">
          {console.log('metadata:')}
          {console.log(metadata)}
          No training sessions to show
        </Alert>}
    </div >
  );
}
