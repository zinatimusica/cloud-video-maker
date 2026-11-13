import React from 'react';
import { Composition } from 'remotion';
import {
  GuysMathSkit,
  KineticPromo,
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
  mediaUrl: '',
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
      />
      <Composition
        id="KineticPromo"
        component={KineticPromo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
      <Composition
        id="FlowOverlay"
        component={FlowOverlay}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
