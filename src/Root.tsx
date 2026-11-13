import React from 'react';
import { CalculateMetadataFunction, Composition } from 'remotion';
import { ModularVideo, ModularProps } from './VideoMaker';

const defaultProps: ModularProps = {
  topBadge: 'GUYS MATH:',
  accentColor: '#facc15',
  hoodieColor: '#a3e635',
  captionStyle: 'classic',
  totalFrames: 450,
  scenes: [],
};

const calcMetadata: CalculateMetadataFunction<ModularProps> = ({ props }) => {
  return {
    durationInFrames: Math.max(90, props.totalFrames || 450),
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ModularVideo"
      component={ModularVideo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={calcMetadata}
    />
  );
};
