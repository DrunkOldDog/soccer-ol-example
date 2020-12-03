import Point from "ol/geom/Point";
import CanvasImmediateRenderer from "ol/render/canvas/Immediate";
import Fill, { Options as FillOptions } from "ol/style/Fill";
import Stroke, { Options as StrokeOptions} from "ol/style/Stroke";
import Style from "ol/style/Style";
import Circle from 'ol/style/Circle';
import Text, { Options as TextOptions } from "ol/style/Text";

const getText = (styles : TextOptions) => new Text(styles);
const getFill = (styles : FillOptions) => new Fill(styles);
const getStroke = (styles : StrokeOptions) => new Stroke(styles);

const setPointStyling = (toCtx : CanvasImmediateRenderer, x : number, y : number, style : Style) => {
  const drawInCanvas = () => toCtx.drawGeometry(new Point([x, y]));
  toCtx.setStyle(style);
  drawInCanvas();
}

export const drawPlayer = (toCtx : CanvasImmediateRenderer, color : string, x : number, y : number) => {
  const playerFill = getFill({ color });
  const playerStroke = getStroke({ color: 'white', width: 2 });
  
  const style = new Style({
    image: new Circle({
      fill: playerFill,
      stroke: playerStroke,
      radius: 10
    })
  });

  setPointStyling(toCtx, x, y, style);
}

export const drawPlayerJersey = (toCtx: CanvasImmediateRenderer, x: number, y: number, number: string) => {
  const playerTextFill = getFill({ color: 'white' });
  const playerTextStroke = getStroke({ color: 'white', width: 0.2 });

  const text = getText({
    text: number,
    font: 'Bold 11px Roboto',
    fill: playerTextFill,
    stroke: playerTextStroke,
    offsetY: 1
  })

  const style = new Style({ text });
  setPointStyling(toCtx, x, y, style);
}