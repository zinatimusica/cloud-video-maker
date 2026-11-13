import React from 'react';
import { CalculateMetadataFunction, Composition } from 'remotion';
import {
  GuysMathSkit,
  KineticPromo,
  StoryCaptions,
  ChartExplainer,
  FlowOverlay,
  VideoProps,
} from './VideoMaker';

const defaultProps: VideoProps = {
  template: 'GuysMathSkit',
  topBadge: 'GUYS MATH:',
  line1: 'Twenty bucks for a shirt? Nah, too expensive.',
  line2: 'Four hundred thousand for this car? Easy.',
  line3: 'Sold the house. Worth it.',
  stampWord: 'SOLD',
  accentColor: '#facc15',
  captionStyle: 'pop',
  chartData: 'Jan:20, Feb:45, Mar:82, Apr:140',
  mediaUrl: '',
  hasAudio: false,
  durationSec: 15,
  words: [],
};

const calcMetadata: CalculateMetadataFunction<VideoProps> = ({ props }) => {
  const sec =
    typeof props.durationSec === 'number' && props.durationSec > 2
      ? props.durationSec
      : 12;
  return {
    durationInFrames: Math.ceil(sec * 30),
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GuysMathSkit"
        component={GuysMathSkit}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calcMetadata}
      />
      <Composition
        id="StoryCaptions"
        component={StoryCaptions}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calcMetadata}
      />
      <Composition
        id="KineticPromo"
        component={KineticPromo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calcMetadata}
      />
      <Composition
        id="ChartExplainer"
        component={ChartExplainer}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calcMetadata}
      />
      <Composition
        id="FlowOverlay"
        component={FlowOverlay}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
