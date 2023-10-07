import { useState, React } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/Col';
import { fetchAddTrainingData } from './Client';
import { TrainingMetaDataList } from './TrainingMetaDataList';
import Container from "react-bootstrap/Container";


function AddTrainingData({ toggleMetadataUpdate, metadata_update_toggle }) {

  const [selectedFile, setSelectedFile] = useState();
  const [trackId, setTrackId] = useState(undefined);

  console.log('Entered Add Training Data');

  const handleFileChange = async (event) => {
    console.log('Entered handleFileChange')
    console.log(event)
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0])

  }
  const handleTextChange = async (event) => {
    console.log('Entered handleTextChange')
    console.log(event)
    console.log(event.target.value)
    setTrackId(event.target.value)
  }

  const handleSubmit = async (event) => {

    console.log('Entered handleSubmit');
    event.preventDefault();


    const formData = new FormData();
    formData.append('data', selectedFile);
    console.log('formData:')
    console.log(formData)
    const data = await fetchAddTrainingData(formData, trackId);
    event.target.reset();
    //setTrackId(undefined);
    console.log(data);
    toggleMetadataUpdate(!metadata_update_toggle);

    return data;
  };

  return (
    <Form onSubmit={handleSubmit} className="pt-3" >
      <Form.Group className="mb-3">
        <Container>
          <Row className="align-items-center">
            <Col sm className='col-md-auto'>
              <Form.Label><b>Add Training Data</b></Form.Label>
            </Col>
            <Col sm className='col-md-auto'>
              <Form.Control required type="file" onChange={handleFileChange} />
            </Col>
            <Col sm className='col-md-auto'>
              <Form.Label><b>Add Track Id</b></Form.Label>
            </Col>
            <Col sm className='col-md-auto'>
              <Form.Control type="text" onChange={handleTextChange} />
            </Col>
            <Col sm className='col-md-auto'>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </Form.Group>

    </Form>);
}

function SportSwitch({ setSport, sport }) {

  const handleChange = async (event) => {
    event.preventDefault();
    setSport(event.target.value);

  };
  return (
    <Form className="pt-3 pb-3">
      <Form.Group>
        <Row className="align-items-center">
          <Col className='col-md-auto'>
            <Form.Label><b>Select Sport</b></Form.Label>
          </Col>
          <Col className='col-md-auto'>
            <Form.Select onChange={handleChange} value={sport}>
              <option value="RUNNING">RUNNING</option>
              <option value="CYCLING">CYCLING</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}

export function Home({ setTrainingDataView, sport, setSport }) {
  // const [sport, setSport] = useState('CYCLING');
  const [metadata_update_toggle, toggleMetadataUpdate] = useState(false);
  //style={{ width: "90%", margin: "0 auto" }}
  return (
    <Container>
      <AddTrainingData
        toggleMetadataUpdate={toggleMetadataUpdate}
        metadata_update_toggle={metadata_update_toggle} />
      <hr />
      <SportSwitch setSport={setSport} sport={sport} />
      <TrainingMetaDataList
        setTrainingDataView={setTrainingDataView}
        metadata_update_toggle={metadata_update_toggle}
        toggleMetadataUpdate={toggleMetadataUpdate}
        sport={sport}
        show_delete={true}
        show_open={true}
      />
    </Container>
  )
}
