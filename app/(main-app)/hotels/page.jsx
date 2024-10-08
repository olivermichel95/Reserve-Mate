"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid } from "react-loader-spinner";
import { AuthContext } from "@/app/AuthContext";
import AuthGuard from "@/app/components/main-app/ui/auth-guard/AuthGuard";
const HotelsPage = () => {
  const router = useRouter();

  // states
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [fadeIn, setFadeIn] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("authToken");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHotels(data);
        setFadeIn(true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [router]);

  if (!currentUser) return <AuthGuard />;

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const truncateText = (text, lines = 3) => {
    if (typeof text !== "string") {
      return "";
    }
    const textLines = text.split(" ");
    if (textLines.length <= lines) {
      return text;
    }
    return textLines.slice(0, lines).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 vw-100 ">
        <Grid
          visible={true}
          height="180"
          width="180"
          color="#dfa974"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-center pt-5">Hotels</h1>
      <ul style={{ listStyleType: "none", padding: 50 }}>
        <div className="d-flex flex-wrap gap-3 justify-content-around">
          {hotels.map((hotel) => {
            const truncatedText = truncateText(hotel.description, 20);

            //  (handle auth of login & create Drawer & EditNavbAr & addHotels);
            const isTruncated =
              hotel.description && typeof hotel.description === "string"
                ? hotel.description.split(" ").length > 20
                : false;

            return (
              <li key={hotel.id} style={{ marginBottom: "1rem" }}>
                <div
                  className={`card fade-in`}
                  style={{
                    width: "18rem",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={hotel.image}
                    className="card-img-top"
                    alt={hotel.name}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{hotel.name}</h5>
                    <div
                      style={{
                        maxHeight: expanded[hotel.id] ? "none" : "4.5em",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <p className="card-text" style={{ margin: 0 }}>
                        {expanded[hotel.id] ? hotel.description : truncatedText}
                      </p>
                    </div>
                    {isTruncated && (
                      <button
                        onClick={() => toggleReadMore(hotel.id)}
                        className="btn btn-link p-0"
                        style={{ color: "#dfa974", fontSize: "18px" }}
                      >
                        {expanded[hotel.id] ? "See less" : "Read more"}
                      </button>
                    )}
                    <div className="d-flex justify-content-between mt-2">
                      <button
                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                        className="primary-btn "
                        style={{ width: "50%", border: "none" }}
                      >
                        More Details
                      </button>
                      <button
                        className="primary-btn"
                        style={{ width: "40%", border: "none" }}
                        onClick={() =>
                          router.push(`/hotels/${hotel.id}/reviews`)
                        }
                      >
                        Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default HotelsPage;
