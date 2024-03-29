import { db } from '../configs/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import API_KEY from './API_KEY';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AppState } from './AppContext';
import filter from '../assets/filter.jpg';
import mostviewed from '../assets/mostviewed.jpg';
import nearby from '../assets/nearby.jpg';
import toprated from '../assets/toprated.jpg';

export function restoDocRef(id) {
  return doc(db, 'restaurants', id);
}

export function PlaceByIdUrl(id) {
  return `https://api.tomtom.com/search/2/place.json?entityId=${id}&key=${API_KEY}&view=IN`;
}

export const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
];

export function FetchCloudData(APIData) {
  const { cloudData, setCloudData } = AppState();

  function HandleUndefined() {
    const newDocData = {
      views: 0,
      ratings: {
        star: 5,
        collection: {
          overall: [{}],
          food: [{}],
          service: [{}],
          quality: [{}],
          valueForMoney: [{}],
        },
      },
      reviews: [{}],
      address: APIData.address,
      openingHours: APIData.openingHours ? APIData.openingHours : null,
      photos: [{}],
    };

    setDoc(retoDocRef(APIData.id), newDocData)
      .then((res) => {
        FetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function FetchData() {
    getDoc(restoDocRef(APIData.id))
      .then((res) => {
        if (res.data()) {
          setCloudData(res.data());
        } else {
          HandleUndefined();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    FetchData();
  }, []);

  return cloudData;
}

export const carouselImages = [
  {
    img: filter,
    // img: 'https://raw.githubusercontent.com/rba1aji/my-assets/main/mostviewed.jpg',
    alt: 'Most Viewed',
    navlink: '/famous-restaurants',
  },
  {
    img: nearby,
    // img: 'https://raw.githubusercontent.com/rba1aji/my-assets/main/nearby.jpg',
    alt: 'Nearby',
    navlink: '/near-by-restaurants',
  },
  {
    img: filter,
    // img: 'https://raw.githubusercontent.com/rba1aji/my-assets/main/filter.jpg',
    alt: 'Filter',
    navlink: '/filter',
  },
  {
    img: toprated,
    // img: 'https://raw.githubusercontent.com/rba1aji/my-assets/main/toprated.jpg',
    alt: 'Top Rated',
    navlink: '/famous-restaurants',
  },
];
