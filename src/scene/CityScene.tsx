import { RoadNetwork } from './RoadNetwork';
import { HeroBus } from './HeroBus';
import { Obstacles } from './Obstacles';
import { Buildings } from './Buildings';
import { Environment } from './Environment';
import { TrafficVehicles } from './TrafficVehicles';
import { Pedestrians } from './Pedestrians';
import { PathDrawing } from './PathDrawing';
import { PathVisualization } from './PathVisualization';

export function CityScene() {
  return (
    <group>
      <RoadNetwork />
      <Buildings />
      <Environment />
      <TrafficVehicles />
      <Pedestrians />
      <Obstacles />
      <HeroBus />
      <PathVisualization />
      <PathDrawing />
    </group>
  );
}

