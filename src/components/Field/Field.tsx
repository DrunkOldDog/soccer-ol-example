import React, { useCallback, useEffect, useState } from 'react';
import ImageMap from './ImageMap';
import './field-styles.scss';
import ImageLayer from 'ol/layer/Image';
import ImageCanvasSource from 'ol/source/ImageCanvas';
import { Map } from 'ol';
import { Extent } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import imagePath from './field.jpg';
import { toContext } from 'ol/render';
import { drawPlayer, drawPlayerJersey } from './fieldUtils/mapStyles';
import CanvasImmediateRenderer from 'ol/render/canvas/Immediate';
import { dummyPlayers } from '../../common/dummy/dummies';

const getMapDeltaCoordinates = (field : Map, canvasExtent : Extent) => {
  const mapExtent = field.getView().calculateExtent(field.getSize());
  const canvasOrigin = field.getPixelFromCoordinate([canvasExtent[0], canvasExtent[3]]);
  const mapOrigin = field.getPixelFromCoordinate([mapExtent[0], mapExtent[3]]);
  return [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];
}

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

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const toCtx = toContext(ctx, { size: [parseInt(width), parseInt(height)], pixelRatio });

    drawCanvasFeatures(toCtx, extent);

    return canvas;
  }

  const drawCanvasFeatures = (toCtx : CanvasImmediateRenderer, extent: Extent) => {
    const [xDelta, yDelta] = getMapDeltaCoordinates(field as Map, extent);
    dummyPlayers.forEach(player => {
      const { position, color, playerNumber } = player;
      const [xPixelPos, yPixelPos] = field?.getPixelFromCoordinate(position) as Array<number>;
      const [xPlayerPos, yPlayerPos] = [xPixelPos + xDelta, yPixelPos + yDelta];
      drawPlayer(toCtx, color, xPlayerPos, yPlayerPos);
      drawPlayerJersey(toCtx, xPlayerPos, yPlayerPos, playerNumber.toString());
    });
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
