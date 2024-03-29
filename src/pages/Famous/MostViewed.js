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

export default function MostViewed(props) {
  const [cloudData, setCloudData] = useState([]);
  const { setLoading } = AppState();

  const fetchTopRated = (state) => {
    const collectionRef = collection(db, 'restaurants');
    const q =
      props.state == 'India'
        ? query(collectionRef, orderBy('views', 'desc'), limit(10))
        : query(
            collectionRef,
            where('address.state', '==', state),
            orderBy('ratings.star', 'desc'),
            limit(10)
          );

    getDocs(q)
      .then((res) => {
        setCloudData([]);
        res.docs.map((doc, index) => {
          setCloudData((old) => {
            const t = old;
            t[index] = { id: doc.id, data: doc.data() };
            return t;
          });
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
    fetchTopRated(props.state);
  }, [props.state]);

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
                <Col
                  style={{ width: '25%' }}
                  // className="col-6 col-md-4"
                  sm={4}
                >
                  <img
                    src={props?.numImg[index]?.url}
                    className="border-0 my-2"
                    style={{
                      width: '120px',
                      height: '60px',
                      objectFit: 'cover',
                      objectPosition: '-25px 50%',
                    }}
                  />
                </Col>
                <Col>
                  <Row
                    xs={1}
                    md={2}
                    className="g-4"
                    // style={{ width: '75%' }}
                  >
                    <li
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
                          {splitAddress(item?.data?.address?.full)}
                        </Card.Text>
                      </Link>
                      <Card.Text className="ps-0">
                        <span style={{ color: '#f1a545' }}>Views: </span>
                        {item?.data?.views}
                      </Card.Text>
                    </li>
                  </Row>
                </Col>
              </Row>
            </Card>
          );
        })}
      </>
    </>
  );
}
