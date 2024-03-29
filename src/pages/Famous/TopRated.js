import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../../configs/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import axios from 'axios';
import { placeByIdUrl } from '../../reducers/URLs';
import { Card, Row, Col } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { Link } from 'react-router-dom';
import { AppState } from '../../reducers/AppContext';

function splitAddress(address) {
  address = address.split(',');
  address =
    address[address.length - 2].replace(new RegExp('[0-9].*'), '') +
    ',' +
    address[address.length - 1];
  return address;
}

export default function TopRated(props) {
  const [cloudData, setCloudData] = useState([]);
  const { setLoading } = AppState();
  // const [APIData, setAPIData] = useState([]);

  // const autoRetryFetch = async (id, index) => {
  //   console.log('AutoRetryFetch');
  //   await axios
  //     .get(placeByIdUrl(id))
  //     .then((res) => {
  //       const data = res.data.results[0];
  //       // console.log(index);
  //       // console.log(data.id, cloudData[index].id);
  //       setAPIData((old) => {
  //         const t = old;
  //         t[index] = data;
  //         return t;
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       autoRetryFetch(id, index);
  //     });
  // };

  const fetchTopRated = (state) => {
    const collectionRef = collection(db, 'restaurants');
    const q =
      props.state == 'India'
        ? query(collectionRef, orderBy('ratings.star', 'desc'), limit(10))
        : query(
            collectionRef,
            where('address.state', '==', state),
            orderBy('ratings.star', 'desc'),
            limit(10)
          );

    getDocs(q)
      .then((res) => {
        // console.log('fetching firestore');
        // setAPIData([]);
        setCloudData([]);
        res.docs.map((doc, index) => {
          setCloudData((old) => {
            const t = old;
            t[index] = {
              id: doc.id,
              data: doc.data(),
              numImgUrl: props?.numImg[index]?.url,
            };
            return t;
          });
          // autoRetryFetch(doc.id, index);
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // console.log(props.state, cloudData);
    props?.numImg[2] && fetchTopRated(props.state);
  }, [props]);

  return (
    <>
      <>
        {cloudData?.map((item, index) => {
          return (
            <Card
              key={index}
              // style={{ marginLeft: '4vw', marginRight: '4vw' }}
              className="mt-4 p-2"
            >
              <Row className="list-unstyled">
                <li
                  style={{ width: '25%' }}
                  // className="border"
                >
                  <img
                    // src={props?.numImg[index]?.url}
                    src={item.numImgUrl}
                    className="border-0 my-2"
                    style={{
                      width: '120px',
                      height: '60px',
                      objectFit: 'cover',
                      objectPosition: '-25px 50%',
                    }}
                  />
                </li>
                <li
                  style={{ width: '75%' }}
                  // className="border"
                >
                  <Link
                    to={`/restaurant/${item.id}`}
                    className="text-reset text-decoration-none"
                  >
                    <Card.Title className=" mb-0">
                      {item?.data?.name}
                    </Card.Title>
                    <Card.Text style={{ fontSize: '80%' }} className="mb-1">
                      {/* {item?.data?.address?.full} */}
                      {splitAddress(item?.data?.address?.full)}
                    </Card.Text>
                  </Link>
                  <span className="pb-0" style={{ fontSize: '90%' }}>
                    {item?.data?.ratings?.star.toFixed(1)}{' '}
                    <span>
                      <Rating
                        className="pb-1"
                        size="20"
                        readonly
                        ratingValue={(item?.data?.ratings?.star * 100) / 5}
                      />
                    </span>
                  </span>
                </li>
              </Row>
            </Card>
          );
        })}
      </>
    </>
  );
}
