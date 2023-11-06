import * as React from "react";
import Button from "@mui/material/Button";
import {
  useDisclosure,
  Button as NextUIButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { NavigationOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DealModal = ({ deal, noMap }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const renderMap = (lat, lng) => {
    return (
      <>
        {!noMap && (
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "250px", width: "100%" }}
          >
            <TileLayer
              attribution='&amp;copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}></Marker>
          </MapContainer>
        )}
        <NextUIButton
          onPress={() => navigateTo(deal.lat, deal.long)}
          endContent={<NavigationOutlined />}
          className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md"
        >
          Get Directions
        </NextUIButton>
      </>
    );
  };

  const navigateTo = (destinationLat, destinationLng) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const onSuccess = (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsDirectionsUrl, "_blank");
    };

    const onError = () => {
      alert(
        "Unable to retrieve your location. Starting location may be inaccurate. Please allow location access in your browser."
      );
      // Just open the google maps directions page without the user's location
      const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsDirectionsUrl, "_blank");
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  return (
    <div>
      <Button onClick={onOpen} size="small">Learn More</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{deal.name}</ModalHeader>
              <ModalBody>
                <div className="font-bold">Description:</div>
                <div>{deal.description}</div>

                <div className="font-bold">Discounts:</div>
                <div>{deal.discount_info}</div>
                {deal.address && (
                  <>
                    <div className="font-bold">Address:</div>
                    <div className="flex flex-col gap-4">
                      {deal.address}
                      {deal.lat && deal.long && renderMap(deal.lat, deal.long)}
                    </div>
                  </>
                )}

                {deal.phone && (
                  <>
                    <div className="font-bold">Phone:</div>
                    <div>
                      <a href={`tel:${deal.phone}`}>{deal.phone}</a>
                    </div>
                  </>
                )}

                {deal.email && (
                  <>
                    <div className="font-bold">Email:</div>
                    <div>
                      <a href={`mailto:${deal.email}`}>{deal.email}</a>
                    </div>
                  </>
                )}

                <div className="font-bold">Website:</div>
                <div>
                  <a href={deal.website} target="_blank" rel="noreferrer">
                    {deal.website}
                  </a>
                </div>
              </ModalBody>
              <ModalFooter>
                <NextUIButton
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="rounded-md"
                >
                  Close
                </NextUIButton>
                <NextUIButton
                  color="primary"
                  onPress={() => navigate(`/deals/${deal.id}`)}
                  className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md"
                >
                  Details
                </NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DealModal;
