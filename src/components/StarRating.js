import React, { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { db } from '../configs/firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function StarRatingForCard(props) {
  const [cloudData, setCloudData] = useState();
  const docRef = doc(db, 'restaurants', props.resto.id);
  // const docRef = restoDocRef(props.resto.id);

  function HandleUndefined() {
    const newDocData = {
      views: 0,
      ratings: {
        star: 0,
        collection: {
          overall: [],
          food: [],
          service: [],
          ambience: [],
          valueForMoney: [],
        },
      },
      reviews: [],
      address: props.resto.address,
      openingHours: props.resto.openingHours ? props.resto.openingHours : null,
      photos: [],
    };

    setDoc(docRef, newDocData)
      .then((res) => {
        unsubscribe();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.data()) {
      setCloudData(doc.data());
    } else {
      HandleUndefined();
    }
  });

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Rating
        ratingValue={(cloudData?.ratings?.star / 5) * 500}
        readonly="true"
        size="22px"
      />
      <div className='ps-2'>views: {cloudData?.views}</div>
    </>
  );
}
