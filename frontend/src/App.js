import { useState, useEffect, React } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Nav } from './Nav';
import { fetchAuthUserData, fetchRegister, fetchLogIn } from "./Client";
import { Home } from './Home';
import { TrainingData } from './TrainingData';


function Register({ setAuthenticationStatus, setAuthenticatedUsername }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (event) => {

    event.preventDefault();
    const result_register = await fetchRegister(username, password, confirmation)

    if (result_register.status === 200) {
      const result_login = await fetchLogIn(username, password);

      if (result_login.status === 200) {
        setAuthenticationStatus(true);
        setAuthenticatedUsername(username);
      }
    }

  }
  return (

    <Form onSubmit={handleSubmit} className="w-50 position-absolute top-50 start-50 translate-middle">
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Control type="password" placeholder="Password Confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>)
}

function ErrorMessage({ message }) {
  return (
    <Alert variant="danger">
      {message}
    </Alert>
  )
}

function Login({ setAuthenticationStatus, setAuthenticatedUsername }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  console.log('Entered Login')
  console.log(username)
  console.log(password)


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Entered handleSubmit')
    console.log(username)
    console.log(password)

    const result = await fetchLogIn(username, password)
    // const data = await result.json()
    if (result.status === 200) {
      setAuthenticationStatus(true);
      setAuthenticatedUsername(username);
      
    } else {
      const data = await result.json()
      console.log('result')
      console.log(result)
      console.log('await result.json()')
      console.log(data)
      setError(data)
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit} className="w-50 position-absolute top-50 start-50 translate-middle">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {error !== '' && <ErrorMessage message={error.error} />}
    </div>
  )
}

function App() {
  console.log('Entered App')

  const [is_registration, setRegistrationView] = useState(undefined);
  const [is_authenticated, setAuthenticationStatus] = useState(undefined);
  const [username, setAuthenticatedUsername] = useState(false);
  const [training_data_view, setTrainingDataView] = useState(undefined);
  const [sport, setSport] = useState('CYCLING');

  useEffect(() => {

    const getNSetAuthUserData = async () => {
      console.log(`Entering getNSetAuthUserData`)
      const data = await fetchAuthUserData();
      console.log(data)
      setAuthenticationStatus(data.is_authenticated)
      setAuthenticatedUsername(data.user_name)
    }
    getNSetAuthUserData();
  }, []);

  return (
    <div className="App">
      <Nav
        setAuthenticationStatus={setAuthenticationStatus}
        is_authenticated={is_authenticated}
        is_registration={is_registration}
        setRegistrationView={setRegistrationView}
        username={username}
        setTrainingDataView={setTrainingDataView}
        sport={sport} />

      {is_authenticated === false && !is_registration &&
        <Login
          setAuthenticationStatus={setAuthenticationStatus}
          setAuthenticatedUsername={setAuthenticatedUsername} />}

      {is_authenticated === false && is_registration &&
        <Register
          setAuthenticationStatus={setAuthenticationStatus}
          setAuthenticatedUsername={setAuthenticatedUsername} />}

      {is_authenticated && training_data_view === undefined &&
        <Home
          setTrainingDataView={setTrainingDataView}
          sport={sport}
          setSport={setSport}
        />}

      {is_authenticated && training_data_view !== undefined &&
        <TrainingData
          training_id_1={training_data_view} />}

    </div>
  );
}
export default App;
