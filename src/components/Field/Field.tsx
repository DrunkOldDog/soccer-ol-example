import React, { useCallback, useEffect, useState } from 'react';
import ImageMap from './ImageMap';
import './field-styles.scss';
import ImageLayer from 'ol/layer/Image';
import ImageCanvasSource from 'ol/source/ImageCanvas';
import { Map } from 'ol';
import { Extent } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import imagePath from './field.jpg';

export const Field = () => {
  const [field, setField] = useState<Map>();
  const [dimensions, setDimensions] = useState<any>();

  const getImageDimensions = () => {
    return new Promise((resolved, rejected) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        resolved([width, height]);
      };
      img.src = imagePath;
    });
  }
  
  useEffect(() => {
    (async function loadImageDimensions() {
      const dimensions = await getImageDimensions();
      setDimensions(dimensions);
    })();
  }, []);

  const addFieldInCanvas = useCallback(() => {
    const canvasLayer = new ImageLayer({
      source: new ImageCanvasSource({
        canvasFunction: canvasFunction as any,
        projection: field?.getView().getProjection()
      })
    });
    canvasLayer.setZIndex(10);
    field?.addLayer(canvasLayer);
  }, [field])

  const canvasFunction = (extent : Extent, resolution : number, pixelRatio : number, size : Array<string>, projection : Projection) => {
    const [width, height] = size;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    return canvas;
  }

  useEffect(() => {
    if (field) {
      addFieldInCanvas();
    }
  }, [field, addFieldInCanvas]);

  return (
    <div className="field-body">
      <ImageMap 
        setField={setField}
        dimensions={dimensions}
      />
    </div>
  )
}
