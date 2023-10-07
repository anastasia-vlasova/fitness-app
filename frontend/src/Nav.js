import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import Button from 'react-bootstrap/Button';
import HomeIcon from '@mui/icons-material/Home';
import { fetchLogOut } from "./Client";

export function Nav({
  setAuthenticationStatus,
  is_authenticated,
  is_registration,
  setRegistrationView,
  username,
  setTrainingDataView,
  sport
}) {


  const handleLogout = async (event) => {
    event.preventDefault();
    const status = await fetchLogOut();
    if (status === 200) {
      setAuthenticationStatus(false);
      setRegistrationView(false);
    }

  };

  const handleLogon = async (event) => {
    event.preventDefault();
    setRegistrationView(false);

  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegistrationView(true);

  };

  const handleHome = async (event) => {
    event.preventDefault();
    setTrainingDataView(undefined);

  };

  return (
    <Navbar bg="dark" variant="dark" className="gap-3 px-3">
      <Container>
        <Navbar.Brand>Fitness App</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end gap-3 px-3">
        {is_authenticated && sport === 'RUNNING' &&
            <Navbar.Text>
              <DirectionsRunOutlinedIcon />
            </Navbar.Text>}
          {is_authenticated && sport === 'CYCLING' &&
            <Navbar.Text>
              <DirectionsBikeOutlinedIcon />
            </Navbar.Text>}
          {is_authenticated &&
            <Navbar.Text>
              Hello, {username}!
            </Navbar.Text>}
          {is_authenticated &&
            <Button variant="light" onClick={e => handleHome(e)}><HomeIcon color="action"/></Button>}
          {is_authenticated &&
            <Navbar.Text>
              <Button variant="light" onClick={e => handleLogout(e)}>Log out</Button>
            </Navbar.Text>}
          {!is_authenticated && !is_registration &&
            <Navbar.Text>
              <Button variant="light" onClick={e => handleRegister(e)}>Register</Button>
            </Navbar.Text>}
          {!is_authenticated && is_registration &&
            <Navbar.Text>
              <Button variant="light" onClick={e => handleLogon(e)}>Log in</Button>
            </Navbar.Text>}


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
