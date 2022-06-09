import React, { useState, useEffect } from "react";
import { StyledMainPage } from "./MainPage.styled";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  Circle,
  Rectangle,
  Polygon,
} from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
const google = window.google;

const MainPage = () => {
  const MAP_API_KEY = process.env.REACT_APP_MAP_API_KEY;
  const [drawingControlEnabled] = useState(true);
  const [marker, setMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [circleRadius, setCircleRadius] = useState(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [rectangle, setRectangle] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [visible] = useState(true);
  const [shapeItems, setShapeItems] = useState([]);

  useEffect(() => {
    console.log(shapeItems);
  }, [shapeItems]);

  const overlay = (e) => {
    console.log(e);
    shapeItems.push(e);
    setShapeItems([...shapeItems]);
    switch (e.type) {
      case "marker":
        setMarker({
          lat: e.overlay.getPosition().lat(),
          lng: e.overlay.getPosition().lng(),
        });
        break;
      case "polyline":
        setPolyline(e.overlay.getPath());
        break;
      case "circle":
        setCircleCenter(e.overlay.getCenter());
        setCircleRadius(e.overlay.getRadius());
        break;
      case "rectangle":
        setRectangle(e.overlay.getBounds());
        break;
      case "polygon":
        setPolygon(e.overlay.getPaths());
        break;
      default:
        break;
    }
  };

  const GoogleMapCustom = withGoogleMap((props) => (
    <GoogleMap
      defaultCenter={{ lat: 13.7223496, lng: 100.5804235 }}
      defaultZoom={17}
    >
      <DrawingManager
        onOverlayComplete={overlay}
        defaultOptions={{
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.CIRCLE,
              google.maps.drawing.OverlayType.POLYGON,
              google.maps.drawing.OverlayType.POLYLINE,
              google.maps.drawing.OverlayType.RECTANGLE,
            ],
          },
        }}
        options={{
          drawingControl: drawingControlEnabled,
        }}
      />

      {marker !== null && <Marker position={marker} draggable={true} />}

      {polyline !== null && <Polyline path={polyline} draggable={true} />}
      {circleRadius !== null && (
        <Circle
          radius={circleRadius}
          center={circleCenter}
          visible={visible}
          draggable={true}
        />
      )}

      {rectangle !== null && <Rectangle bounds={rectangle} draggable={true} />}
      {polygon !== null && <Polygon paths={polygon} draggable={true} />}
    </GoogleMap>
  ));
  return (
    <StyledMainPage>
      <GoogleMapCustom
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&libraries=drawing`}
        loadingElement={<div style={{ height: `100vh` }} />}
        containerElement={<div style={{ height: `500px`, width: "100%" }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </StyledMainPage>
  );
};

export default MainPage;
