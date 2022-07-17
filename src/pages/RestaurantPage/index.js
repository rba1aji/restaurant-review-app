import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const KEY = `O1W6gyHOMcvAfFFPGxQOGR2mBzWUAH2P`;

export default function SelectedRestaurant() {
  const { id } = useParams();
  const [res, setRes] = useState();
  const placeByIdUrl = `https://api.tomtom.com/search/2/place.json?entityId=${id}&key=${KEY}&view=IN`;

  async function FetchResData() {
    await axios
      .get(placeByIdUrl)
      .then((r) => {
        setRes(r.data.results[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    FetchResData();
  }, []);

  return (
    <div>
      <h1>{res?.poi?.name}</h1>
    </div>
  );
}
