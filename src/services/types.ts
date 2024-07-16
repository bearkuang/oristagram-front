import { Area } from 'react-easy-crop/types';

export interface ImageData {
  file: File;
  url: string;
  cropped: string;
  croppedUrl?: string;
  filter: string;
  crop?: CropArea;
}

export interface CropArea extends Area {
  zoom: number;
}