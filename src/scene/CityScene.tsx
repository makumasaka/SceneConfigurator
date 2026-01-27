import React, { useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { RoadNetwork } from './RoadNetwork';
import { HeroBus } from './HeroBus';
import { Obstacles } from './Obstacles';
import { Buildings } from './Buildings';
import { Environment } from './Environment';
import { TrafficVehicles } from './TrafficVehicles';
import { Pedestrians } from './Pedestrians';
import { PathDrawing } from './PathDrawing';
import { PathVisualization } from './PathVisualization';
import { DistanceMeasurement } from './DistanceMeasurement';
import { useOperatorStore } from '../store/useOperatorStore';

export function CityScene() {
  const isMeasuringDistance = useOperatorStore((state) => state.isMeasuringDistance);
  const addDistancePoint = useOperatorStore((state) => state.addDistancePoint);

  const handleMeasurePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!isMeasuringDistance) return;
      if (event.button !== 0) return;

      event.stopPropagation();

      addDistancePoint({
        x: event.point.x,
        y: event.point.y,
        z: event.point.z,
      });
    },
    [addDistancePoint, isMeasuringDistance]
  );

  return (
    <group>
      <RoadNetwork onPointerDown={handleMeasurePointerDown} />
      <Buildings onPointerDown={handleMeasurePointerDown} />
      <Environment onPointerDown={handleMeasurePointerDown} />
      <TrafficVehicles />
      <Pedestrians />
      <Obstacles />
      <HeroBus />
      <PathVisualization />
      <PathDrawing />
      <DistanceMeasurement />
    </group>
  );
}

