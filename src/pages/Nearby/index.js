import React, { useRef, useState, useEffect } from 'react';
import { FormControl, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { TbCurrentLocation } from 'react-icons/tb';
import API_KEY from '../../components/GetAPIKey';
import Loader from '../../components/Loader';
import ShowNearbyRestaurants from './ShowNearbyRestaurants';

function scrollToRef(ref) {
  window.scrollTo(0, ref.current.offsetTop);
}

export default function Nearby() {
  const currLocationRef = useRef('');
  const contentRef = useRef();
  const [suggestionCityList, setsuggestionCityList] = useState([]);
  const [latLon, setLatLon] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [nearbyList, setNearbyList] = useState([]);
  const [locationErr, setLocationErr] = useState('');

  const nearbyUrl = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${API_KEY}&${latLon}&countrySet=IN&categorySet=7315&view=IN&limit=100`;

  //////////////////  LATLON 2 RESULT    //////////////////
  function MakeNearbyList(arr) {
    setSelectedPlace(arr[0].address.localName);
    arr.map((item) => {
      const details = {
        id: item.id,
        name: item.poi.name,
        address: item.address.freeformAddress,
        phone: item.poi.phone,
        tags: item.poi.categories,
        openingHours: item.openingHours,
        score: item.score,
      };
      setNearbyList((old) => {
        return [...old, details];
      });
      // nearbyList.sort((a, b) => {
      //   console.log(a.score - b.score)
      //   return a.score - b.score;}
      //   );
    });
    scrollToRef(contentRef);
    setLoading(false);
  }

  //////////// WHEN LAT LON CHANGE ///////////
  // if(selectedPlace) {
  useEffect(() => {
    setNearbyList([]);
    axios
      .get(nearbyUrl)
      .then((res) => {
        MakeNearbyList(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [nearbyUrl]);
  // }

  ////////////// HANDLE SELECTED //////////////
  function HandleSelected(geoNameId) {
    currLocationRef.current.value = '';
    setsuggestionCityList();
    setSelectedPlace();
    setNearbyList([]);
    setLoading(true);
    const latLonUrl = `https://api.teleport.org/api/cities/geonameid%3A${geoNameId}`;
    axios
      .get(latLonUrl)
      .then((res) => {
        setSelectedPlace(res.data.full_name.split(',')[0]);
        setLatLon(
          `lat=${res.data.location.latlon.latitude}&lon=${res.data.location.latlon.longitude}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ////////// SHOW SUGGESTION ///////////////
  function ShowCitySuggestion() {
    return (
      <ul className="list-unstyled p-4 pb-2 pt-2 border border-prime">
        {suggestionCityList.map((item) => {
          const name = item.matching_full_name;
          if (name.includes('India')) {
            let geoNameId = item['_links']['city:item']['href'].split('/');
            geoNameId = geoNameId[geoNameId.length - 2];
            geoNameId = geoNameId.split(':')[1];
            return (
              <li className="mb-2" onClick={() => HandleSelected(geoNameId)}>
                {name.split(',')[0]}
              </li>
            );
          }
        })}
      </ul>
    );
  }

  ///////////// DETECT LOCATION ////////////
  function AutoLocationDetect() {
    function getPosition(position) {
      setLatLon(
        `lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      );
    }
    function showError(error) {
      setLoading(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationErr('Request denied for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          setLocationErr('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setLocationErr('The request timed out.');
          break;
        case error.UNKNOWN_ERROR:
          setLocationErr('An unknown error occurred.');
          break;
      }
      locationErr && alert(locationErr);
    }
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  function ManualLocationDetect(query) {
    const suggestionCityListUrl = `https://api.teleport.org/api/cities/?search=${query}&limit=25`;

    axios
      .get(suggestionCityListUrl)
      .then((res) => {
        setsuggestionCityList(res.data._embedded['city:search-results']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Loader flag={loading} />
      {/* <DownALert msg={locationErr} /> */}
      <div
        className=""
        style={{
          display: 'grid',
          marginTop: '10vh',
          marginLeft: '20vw',
          marginRight: '20vw',
          // marginBottom: '10vh',
        }}
      >
        <Button
          // variant="outline-dark"
          variant="dark"
          size="md"
          className="ms-1 me-1 p-2"
          style={{ wordSpacing: 3 }}
          onClick={() => {
            AutoLocationDetect();
          }}
        >
          Use Current L
          <span className="pb-5">{<TbCurrentLocation size="15" />}</span>cation
        </Button>
        <p className="text-center m-2">or</p>
        <Form.Group>
          <p className="mb-1 text-center">Enter location manually</p>
          <Form.Control
            className="border-dark p-2"
            type="text"
            placeholder="your location..?"
            ref={currLocationRef}
            onChange={(e) => {
              // e.preventDefault();
              ManualLocationDetect(currLocationRef.current.value);
            }}
          />
          {currLocationRef.current.value && <ShowCitySuggestion />}
        </Form.Group>
      </div>

      <div>
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            marginLeft: '45vw',
            marginTop: '45vh',
          }}
        >
          <Loader />
        </div>
        <div ref={contentRef} style={{ minHeight: '100vh', paddingTop: 45 }}>
          {!loading && (
            <ShowNearbyRestaurants
              place={selectedPlace}
              nearbyList={nearbyList}
            />
          )}
        </div>
      </div>
    </>
  );
}
