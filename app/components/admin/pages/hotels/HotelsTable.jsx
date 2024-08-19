"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { MdEditSquare } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import PaginationStyle1 from "../../ui/paginators/PaginationStyle1";// Adjust this path if needed
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
 
import { db } from "@/app/firebase";

 
 

const HotelsTable = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const hotelsCollection = collection(db, "hotels");
        const hotelSnapshot = await getDocs(hotelsCollection);
        const hotelList = hotelSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelList);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleEdit = async (id, updatedData) => {
    try {
      const hotelDoc = doc(db, "hotels", id);
      await updateDoc(hotelDoc, updatedData);
      console.log("Hotel updated successfully!");
      setHotels(hotels.map(hotel => hotel.id === id ? { ...hotel, ...updatedData } : hotel));
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const hotelDoc = doc(db, "hotels", id);
      await deleteDoc(hotelDoc);
      setHotels(hotels.filter((hotel) => hotel.id !== id));
      console.log("Hotel deleted successfully!");
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          className="w-75"
          placeholder="Search for hotels..."
        />
        <Button variant="success">Add new hotel</Button>
      </div>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Image</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td><img src={hotel.image} alt={hotel.title} style={{ width: '100px' }} /></td>
              <td>{hotel.price}</td>
              <td>
                <Button onClick={() => handleEdit(hotel.id, { name: "Updated Hotel Name" })} size="sm" variant="primary" className="me-2">
                  <MdEditSquare size={16} />
                </Button>
                <Button onClick={() => handleDelete(hotel.id)} size="sm" variant="danger">
                  <IoTrashBin size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center mt-3">
        <PaginationStyle1 />
      </div>
    </Fragment>
  );
};

export default HotelsTable;