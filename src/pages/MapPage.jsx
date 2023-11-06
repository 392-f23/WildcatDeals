import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, LayersControl, useMapEvents, Circle } from "react-leaflet";
import DealCard from "../components/DealCard";

import useDealsStore from "../utilities/stores";
import { part1, part2, part3, part4 } from "../utilities/utils";
import { motion } from 'framer-motion';

import GLayer from "react-leaflet-google-layer";
import './MapPage.css';

const assemble = (p1, p2, p3, p4) => `${p1}${p4}${p3}${p2}`;

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 25 } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.25 } }
};

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const violetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapPage = () => {
  const allDeals = useDealsStore((state) => state.business);
  const assembly = assemble(part1, part2, part3, part4);
  const [position, setPosition] = useState(null)
  const [nearestDeals, setNearestDeals] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const handleMouseEnter = (dealId) => {
    setHoveredCardId(dealId);
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
  };

  useEffect(() => {
    if (position && allDeals.length > 0) {
      const userLat = position.latlng.lat;
      const userLng = position.latlng.lng;
      const calculatedNearestDeals = allDeals
        .map((deal) => {
          if (!deal.lat || !deal.long) {
            return { ...deal, distance: Infinity }; // Return a deal with a "distance" that will sort last
          }

          const dealLat = parseFloat(deal.lat);
          const dealLng = parseFloat(deal.long);

          // Check if conversion resulted in NaN
          // This should not happen because the data should be clean
          if (isNaN(dealLat) || isNaN(dealLng)) {
            console.error('Invalid coordinates for deal:', deal);
            return { ...deal, distance: Infinity };
          }

          const distance = Math.sqrt((dealLat - userLat) ** 2 + (dealLng - userLng) ** 2);
          return { ...deal, distance };
        })
        .filter(deal => !isNaN(deal.distance)) // Exclude deals with NaN distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setNearestDeals(calculatedNearestDeals);
    }
  }, [position, allDeals]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e)
        map.flyTo(e.latlng, 18)
      },
    })

    return position === null ? null : (
      <>
        <Marker position={position.latlng} icon={redIcon}>
          <Popup><b>You are here</b><br />The current location accuracy is {position.accuracy} meters</Popup>
        </Marker>
        <Circle center={position.latlng} radius={position.accuracy} />
      </>
    )
  }

  return (
    <div className="flex h-screen">
      {position && (
        <motion.div
          className="sidebar w-1/4 bg-white overflow-auto scrollbar-thin"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-col gap-2 p-4 pt-20">
            <h2 className="text-2xl font-semibold border-b py-4">Closest Deals</h2>
            {nearestDeals.map((deal) => (
              <div
                onMouseEnter={() => handleMouseEnter(deal.id)}
                onMouseLeave={handleMouseLeave}
                key={deal.id}
              >
                <DealCard key={deal.id} deal={deal} noMap={true} noDealsPageRedirect={true} noZoomEffect={true} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className={position ? "w-3/4 map-container" : "w-full"}>
        <MapContainer
          center={[42.05103, -87.67788]}
          zoom={15}
          style={{ width: "100%", height: "100%", zIndex: 0 }}
          zoomControl={false}
        >
          <LayersControl position="bottomright">
            <LayersControl.Overlay name="Transit">
              <GLayer apiKey={assembly} type={'roadmap'} googleMapsAddLayers={[{ name: 'TransitLayer' }]} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Cycling">
              <GLayer apiKey={assembly} type={'roadmap'} googleMapsAddLayers={[{ name: 'BicyclingLayer' }]} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Traffic">
              <GLayer apiKey={assembly} type={'roadmap'} googleMapsAddLayers={[{ name: 'TrafficLayer' }]} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Hybrid">
              <GLayer apiKey={assembly} type={'hybrid'} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Satellite">
              <GLayer apiKey={assembly} type={'satellite'} />
            </LayersControl.Overlay>
          </LayersControl>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <ZoomControl position="bottomright" />

          {allDeals.map((deal) => {
            const markerIcon = hoveredCardId === deal.id ? orangeIcon : violetIcon;

            if (deal.lat && deal.long) {
              return (
                <Marker position={[deal.lat, deal.long]} icon={markerIcon} key={deal.id}>
                  <Popup>
                    <DealCard key={deal.id} deal={deal} noShadow={true} noMap={true} noPaddings={true} noDealsPageRedirect={true} noZoomEffect={true} />
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}


          <LocationMarker />

        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
