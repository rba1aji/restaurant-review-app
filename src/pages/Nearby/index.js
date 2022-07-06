import React, { useRef, useState } from 'react';
import { FormControl, Button, Form } from 'react-bootstrap';
import axios from 'axios';

import ShowNearbyRestaurants from './ShowNearbyRestaurants';
import API_KEY from '../../components/GetAPIKey';

export default function Nearby() {
  const currLocationRef = useRef('');
  const [cityList, setCityList] = useState([]);
  const [nearbyList, setNearbyList] = useState([]);
  const [latlon] = useState('');

  function HandleSelected(geoNameId) {
    console.log();
  }

  function Suggestion() {
    return (
      <ul className="list-unstyled p-4 pb-2 pt-2 border border-prime">
        {cityList.map((item) => {
          const name = item.matching_full_name;
          let geoNameId = item['_links']['city:item']['href'].split('/');
          geoNameId = geoNameId[geoNameId.length - 2];
          if (name.includes('India')) {
            // console.log(geoNameId);
            return (
              <li onClick={() => HandleSelected(geoNameId)}>
                {name.split(',')[0]}
              </li>
            );
          }
        })}
      </ul>
    );
  }

  function AutoLocationDetect() {
    const URL = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${API_KEY}&lat=${lat}&lon=${lon}&countrySet=IN&categoryset=7315&view=IN`;
  }

  function ManualLocationDetect(place) {
    const CityListUrl = `https://api.teleport.org/api/cities/?search=${place}&limit=25`;

    axios
      .get(CityListUrl)
      .then((res) => {
        setCityList(res.data._embedded['city:search-results']);
        // console.log(cityList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div
        className="mt-4 mb-5"
        style={{
          display: 'grid',
          marginLeft: '15vw',
          marginRight: '15vw',
        }}
      >
        <Button variant="outline-dark" size="md" className="ms-1 me-1">
          Use current location
        </Button>
        <p className="text-center m-2">or</p>
        <Form.Group>
          <p className="mb-1 text-center">Enter location manually</p>
          <Form.Control
            className="border-dark"
            type="text"
            placeholder="your location..?"
            ref={currLocationRef}
            onChange={(e) => {
              e.preventDefault();
              const place = currLocationRef.current.value;
              ManualLocationDetect(place);
            }}
          />
          {currLocationRef.current.value && <Suggestion />}
        </Form.Group>
      </div>
      <h1>Nearby Restaurants</h1>
    </>
  );
}
