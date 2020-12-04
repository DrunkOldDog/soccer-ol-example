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
import { FIELD_END_LINE, PLAYER_SPEED_LIMIT } from '../../common/helpers/constants';
import { FieldInterface } from './types';

const getMapDeltaCoordinates = (field : Map, canvasExtent : Extent) => {
  const mapExtent = field.getView().calculateExtent(field.getSize());
  const canvasOrigin = field.getPixelFromCoordinate([canvasExtent[0], canvasExtent[3]]);
  const mapOrigin = field.getPixelFromCoordinate([mapExtent[0], mapExtent[3]]);
  return [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];
}

const getImageLayer = (field : Map) => field.getLayers().getArray().slice(-1);

export const Field = ({ play, setPlay, scoreBoard, setScoreboard } : FieldInterface) => {

  const [field, setField] = useState<Map>();
  const [players, setPlayers] = useState([...dummyPlayers]);
  const [dimensions, setDimensions] = useState<any>();

  const makePlayersRun = async () => {
    const [canvasLayer] = getImageLayer(field!) as any;
    for (let i = 0;; i++) {
      const unmutedPlayers = [...players];
      await new Promise(resolve => setTimeout(resolve, 50));

      let winnerPlayerId = 0;
      const trigger = unmutedPlayers.some((player, index) => {
        const [xPos, yPos] = player.position;
        const position = [xPos + Math.random() * PLAYER_SPEED_LIMIT, yPos];
        unmutedPlayers[index] = Object.assign(unmutedPlayers[index], { position });
        winnerPlayerId = player.playerId;
        return FIELD_END_LINE <= position[0];
      })

      setPlayers(unmutedPlayers);
      canvasLayer.getSource().changed();

      if (trigger) {
        setPlay(false);
        const actualScore = scoreBoard[winnerPlayerId] ? scoreBoard[winnerPlayerId] + 1 : 1;
        setScoreboard({ ...scoreBoard, [winnerPlayerId]: actualScore });
        await new Promise(resolve => setTimeout(resolve, 1));
        resetDummyData();
        break;
      }
    }
  }

  const resetDummyData = ()=> {
    dummyPlayers.forEach(player => {
      const [, yPos] = player.position;
      player.position = [280, yPos];
    })
  }

  useEffect(() => {
    if (play && field) {
      makePlayersRun();
    }
  }, [play, field]);

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
    players.forEach(player => {
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
      {dimensions && (
        <ImageMap 
          setField={setField} 
          dimensions={dimensions} 
          />
        )}
    </div>
  )
}
