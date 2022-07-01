import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [input, setInput] = useState('amman');
  const [options, setOptions] = useState([]);
  const KEY = `O1W6gyHOMcvAfFFPGxQOGR2mBzWUAH2P`;
  // const searchUrl = `https://{baseURL}/search/{versionNumber}/search/{query}.json?key={Your_API_Key}&limit={limit}&categorySet={categorySet}`;
  const URL = `https://api.tomtom.com/search/2/search/${input}.json?catagorySet=restaurant&key=${KEY}`;

  var config = {
    method: 'get',
    url: URL,
    headers: {},
  };

  useEffect(() => {
    axios(config)
      .then((res) => {
        const s=JSON.stringify(res.data);
        // JSON.stringify(res.data);
        console.log(res);
        // setOptions(JSON)
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return (
    <>
      <input
        placeholder="Search..."
        onChange={(e) => setInput(e.target.value)}
      />
    </>
  );
}
