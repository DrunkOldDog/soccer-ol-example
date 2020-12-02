import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';

import Map from "ol/Map";
import View from "ol/View";
import Projection from "ol/proj/Projection";
import { Extent, getCenter } from 'ol/extent';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import { ImageMapInterface } from './types';

import fieldImage from './field.jpg';

/* eslint-disable */

const zoom = 1;
const maxZoom = 8;

const getMapView = (projection : Projection, extent : Extent) => {
  return new View({
    zoom,
    maxZoom,
    projection,
    center: getCenter(extent),    
  });
};

const getMapProjection = (extent : Extent) => {
  return new Projection({
    extent,
    units: 'pixels',
    code: 'xkcd-image'
  });
};

const getMapImageLayer = (projection : Projection, imageExtent : Extent) => {
  const [, , width, height] = imageExtent;

  return new Static({
    projection,
    imageExtent,
    imageSize: [width, height],
    url: '',
    imageLoadFunction: (image : any) => {
      image.getImage().src = fieldImage;
    }
  });
};

export default ({ setField, dimensions = [] } : ImageMapInterface) => {
  const mapContainer = useRef<any>();

  useEffect(() => {
    if (dimensions.length) {
      const [width, height] = dimensions;
      const extent = [0, 0, width, height] as Extent;
      const projection = getMapProjection(extent);
      const view = getMapView(projection, extent);
  
      const imageLayer = new ImageLayer({
        source: getMapImageLayer(projection, extent)
      });
      initOpenLayersMap(imageLayer, view);
    }
  }, [dimensions]);

  const initOpenLayersMap = (imageLayer: ImageLayer, view: View) => {
    const map = new Map({
      layers: [imageLayer],
      target: undefined,
      controls: []
    });
    map.setView(view);
    map.setTarget(mapContainer.current);
    setField(map);
  };

  return (
    <div ref={mapContainer} className="ol-map" />
  );
}